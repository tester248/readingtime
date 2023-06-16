const startPage = document.querySelector("#start-page");
const endPage = document.querySelector("#end-page");
const avgTime = document.querySelector("#avg-time");
const result = document.querySelector("#result");
const progress = document.querySelector("#progress");

let startTime;
let interval;
let paused = false;
let pauseTime;
let pauseDuration = 0;

document.querySelector("#start-pause").addEventListener("click", () => {
  if (!paused) {
    if (!startTime) {
      startTime = new Date();
    } else {
      pauseDuration += new Date() - pauseTime;
    }
    interval = setInterval(updateProgress, 1000);
    paused = true;
    document.querySelector("#start-pause").textContent = "Pause";
  } else {
    clearInterval(interval);
    pauseTime = new Date();
    paused = false;
    document.querySelector("#start-pause").textContent = "Start";
  }
});

document.querySelector("#reset").addEventListener("click", () => {
  clearInterval(interval);
  paused = false;
  pauseTime = null;
  startTime = null;
  pauseDuration = 0;
  result.textContent = "";
  progress.textContent = "";
  document.querySelector("#start-pause").textContent = "Start";
});

function calculate() {
  const start = parseInt(startPage.value);
  const end = parseInt(endPage.value);
  const avg = parseInt(avgTime.value);

  if (isNaN(start) || isNaN(end) || isNaN(avg)) {
    result.textContent = "Please enter valid values";
    return;
  }

  const totalPages = end - start + 1;
  const totalMinutes = totalPages * avg;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  result.innerHTML =
    "Estimated Reading Time: " +
    (hours > 0 ? hours + "hr " : "") +
    minutes +
    "min" +
    "<br>Estimated Time of Completion: ";
}

function updateProgress() {
  if (!startTime) return;

  const start = parseInt(startPage.value);
  const end = parseInt(endPage.value);
  const avg = parseInt(avgTime.value);

  if (isNaN(start) || isNaN(end) || isNaN(avg)) return;

  const now = new Date();

  const elapsedTime =
    (now.getTime() - startTime.getTime() - pauseDuration) / (1000 * avg * 60);

  const currentPageFloat =
    Math.min(elapsedTime + start, end);
  const currentPageInt =
    Math.min(Math.floor(elapsedTime + start), end);

  const totalPages =
    end - start + 1;

  const percentage =
    ((currentPageFloat - start) / totalPages) * 100;

  progress.innerHTML =
    `Current Page: ${currentPageInt}<br>` +
    `Percentage Completed: ${percentage.toFixed(2)}%`;

  const remainingPages =
    end - currentPageFloat;
  const remainingMinutes =
    remainingPages * avg;

  const completionTime =
    new Date(now.getTime() + remainingMinutes * 60 * 1000);

  const completionTimeString =
    completionTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  result.innerHTML =
    result.innerHTML.split("<br>")[0] +
    `<br>Estimated Time of Completion: ${completionTimeString}`;

  const remainingHours =
    Math.floor(remainingMinutes / 60);
  const remainingMins =
    Math.round(remainingMinutes % 60);

  progress.innerHTML +=
    `<br>Time Remaining: ${remainingHours > 0 ? remainingHours + "hr " : ""
    } ${remainingMins}min`;
}
