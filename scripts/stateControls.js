class PomodoroTimer {
  constructor() {
    this.state = "pomodoro";
    this.pomodoroTime = 25; // Ajusta a 25 minutos para un ciclo típico de Pomodoro
    this.shortTime = 5;
    this.longTime = 15;
    this.timerTime = this.pomodoroTime;
    this.secondsTimerTime = this.timerTime * 60;
    this.timerInterval = null;
    this.timerControlState = "play";
    this.autoStartBreak = true;
    this.autoStartPomodoro = true;
    this.currentPomodoro = 1;

    this.pomodoroOption = document.querySelector("#pomodoro");
    this.shortOption = document.querySelector("#short");
    this.longOption = document.querySelector("#long");
    this.timer = document.querySelector("#timer");
    this.clock = document.querySelector("#clock");
    this.timerControl = document.querySelector("#timer-control");

    this.addEventListeners();
    this.updateTimerDisplay();
  }

  setState(newState) {
    this.state = newState;
  }

  setTimerTime(time) {
    this.timerTime = time;
    this.secondsTimerTime = time * 60;
  }

  setTimerControlState() {
    this.timerControlState =
      this.timerControlState === "play" ? "pause" : "play";
  }

  timerConversor(time) {
    return time < 10 ? `0${time}` : time;
  }

  updateTimerDisplay() {
    const minuteTimer = Math.floor(this.secondsTimerTime / 60);
    const secondsTimer = this.secondsTimerTime % 60;
    this.timer.innerHTML = `${this.timerConversor(
      minuteTimer
    )}:${this.timerConversor(secondsTimer)}`;
  }

  changeBackground(seconds, variant) {
    const barPercent = (variant / seconds) * 100;
    const otherBar = 100 - barPercent;
    this.clock.style.background = `conic-gradient(
      var(--primary-color) ${otherBar * 3.6}deg,
      var(--third-color) ${otherBar * 3.6}deg
    )`;
  }

  actionTimer() {
    const secondsBar = this.timerTime * 60;

    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.secondsTimerTime -= 1;
        this.updateTimerDisplay();
        this.changeBackground(secondsBar, this.secondsTimerTime);
        if (this.secondsTimerTime === 0) {
          this.stopTimerInterval();
          this.clock.style.background = `conic-gradient(var(--primary-color) 0deg, var(--third-color) 0deg)`;
          this.handleCycleCompletion();
        }
      }, 1000);
    }
  }

  stopTimerInterval() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  handleCycleCompletion() {
    if (this.state === "pomodoro") {
      this.currentPomodoro++;
      if (this.currentPomodoro % 4 === 0) {
        this.setState("long");
        this.setTimerTime(this.longTime);
      } else {
        this.setState("short");
        this.setTimerTime(this.shortTime);
      }
    } else {
      this.setState("pomodoro");
      this.setTimerTime(this.pomodoroTime);
    }

    if (
      (this.state === "short" && this.autoStartBreak) ||
      (this.state === "long" && this.autoStartBreak) ||
      (this.state === "pomodoro" && this.autoStartPomodoro)
    ) {
      this.setTimerControlState(); // Set the state to 'pause'
      this.timerControl.innerHTML = this.timerControlState;
      this.actionTimer();
    } else {
      this.timerControlState = "play";
      this.timerControl.innerHTML = this.timerControlState;
      this.updateTimerDisplay();
    }
  }

  handleOptionClick(option, stateValue, time) {
    this.stopTimerInterval();
    this.timerControlState = "play";
    this.timerControl.innerHTML = this.timerControlState;
    this.setState(stateValue);
    document
      .querySelector(".main__option--selected")
      .classList.remove("main__option--selected");
    option.classList.add("main__option--selected");
    this.setTimerTime(time);
    this.updateTimerDisplay();
    this.clock.style.background = `conic-gradient(var(--primary-color) 0deg, var(--third-color) 0deg)`;
    console.log(this.state);
  }

  addEventListeners() {
    this.timerControl.addEventListener("click", () => {
      this.setTimerControlState();
      this.timerControl.innerHTML = this.timerControlState;
      if (this.timerControlState === "pause") {
        this.actionTimer();
      } else {
        this.stopTimerInterval();
      }
    });

    this.pomodoroOption.addEventListener("click", () =>
      this.handleOptionClick(this.pomodoroOption, "pomodoro", this.pomodoroTime)
    );
    this.shortOption.addEventListener("click", () =>
      this.handleOptionClick(this.shortOption, "short", this.shortTime)
    );
    this.longOption.addEventListener("click", () =>
      this.handleOptionClick(this.longOption, "long", this.longTime)
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PomodoroTimer();
});
