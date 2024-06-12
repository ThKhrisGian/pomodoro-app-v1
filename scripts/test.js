import auido from "../audios/bedside-clock-alarm-95792.mp3";

class PomodoroTimer {
  constructor() {
    this.state = "pomodoro";
    this.times = {
      pomodoro: 25,
      short: 5,
      long: 15,
    };
    this.timerTime = this.times.pomodoro;
    this.secondsTimerTime = this.timerTime * 60;
    this.timerInterval = null;
    this.timerControlState = "play";
    this.autoStartBreak = false;
    this.autoStartPomodoro = false;
    this.currentPomodoro = 1;
    this.speed = 175;

    this.initializeDOMElements();
    this.sound = new Audio(auido);

    this.addEventListeners();
    this.updateTimerDisplay();
  }

  initializeDOMElements() {
    this.pomodoroOption = document.querySelector("#pomodoro");
    this.shortOption = document.querySelector("#short");
    this.longOption = document.querySelector("#long");
    this.timer = document.querySelector("#timer");
    this.clock = document.querySelector("#clock");
    this.timerControl = document.querySelector("#timer-control");
  }

  setState(newState) {
    this.state = newState;
  }

  setTimerTime(time) {
    this.timerTime = time;
    this.secondsTimerTime = time * 60;
  }

  toggleTimerControlState() {
    this.timerControlState =
      this.timerControlState === "play" ? "pause" : "play";
  }

  formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.secondsTimerTime / 60);
    const seconds = this.secondsTimerTime % 60;
    this.timer.innerHTML = `${this.formatTime(minutes)}:${this.formatTime(
      seconds
    )}`;
  }

  changeBackground(seconds, variant) {
    const barPercent = (variant / seconds) * 100;
    const otherBar = 100 - barPercent;
    this.clock.style.background = `conic-gradient(
      var(--primary-color) ${otherBar * 3.6}deg,
      var(--third-color) ${otherBar * 3.6}deg
    )`;
  }

  startTimer() {
    const secondsBar = this.timerTime * 60;

    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.secondsTimerTime -= 1;
        this.updateTimerDisplay();
        this.changeBackground(secondsBar, this.secondsTimerTime);
        if (this.secondsTimerTime === 0) {
          this.stopTimer();
          this.clock.style.background = `conic-gradient(var(--primary-color) 0deg, var(--third-color) 0deg)`;
          this.sound.play();
          this.sound.onended = () => {
            this.sound.currentTime = 0;
            if (!this.autoStartBreak) {
              this.resetTimerControl();
            } else {
              this.changeState();
            }
          };
        }
      }, this.speed);
    }
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  resetTimerControl() {
    this.timerControlState = "play";
    this.timerControl.innerHTML = this.timerControlState;
    this.setTimerTime(this.timerTime);
    this.updateTimerDisplay();
  }

  changeState() {
    if (this.state === "pomodoro" && this.currentPomodoro === 7) {
      this.setBreakState("long", this.times.long, this.longOption);
    } else if (this.state === "long" && this.currentPomodoro === 8) {
      this.setPomodoroState(
        this.times.pomodoro,
        this.pomodoroOption,
        !this.autoStartPomodoro
      );
    } else if (this.state === "pomodoro" && this.currentPomodoro % 2 !== 0) {
      this.setBreakState("short", this.times.short, this.shortOption);
    } else if (this.state === "short" && this.currentPomodoro % 2 === 0) {
      this.setPomodoroState(this.times.pomodoro, this.pomodoroOption);
    } else {
      this.resetTimerControl();
    }
  }

  setBreakState(state, time, option) {
    this.setState(state);
    this.setTimerTime(time);
    this.switchSelectedOption(option);
    this.currentPomodoro++;
    this.updateTimerDisplay();
    this.startTimer();
    console.log(`Pomodoro actual: ${this.currentPomodoro}`);
    console.log(`Estado actual: ${this.state}`);
  }

  setPomodoroState(time, option, resetPomodoroCount = false) {
    this.setState("pomodoro");
    this.setTimerTime(time);
    this.switchSelectedOption(option);
    this.currentPomodoro =
      resetPomodoroCount || this.currentPomodoro >= 8
        ? 1
        : this.currentPomodoro + 1;
    this.updateTimerDisplay();
    if (!resetPomodoroCount) {
      this.startTimer();
    }
    console.log(`Pomodoro actual: ${this.currentPomodoro}`);
    console.log(`Estado actual: ${this.state}`);
  }

  switchSelectedOption(option) {
    document
      .querySelector(".main__option--selected")
      .classList.remove("main__option--selected");
    option.classList.add("main__option--selected");
  }

  handleOptionClick(option, stateValue, time) {
    this.stopTimer();
    this.setState(stateValue);
    this.currentPomodoro = 1;
    this.switchSelectedOption(option);
    this.setTimerTime(time);
    this.updateTimerDisplay();
    this.resetClockBackground();
    console.log(`Pomodoro actual: ${this.currentPomodoro}`);
    console.log(`Estado actual: ${this.state}`);
  }

  resetClockBackground() {
    this.clock.style.background = `conic-gradient(var(--primary-color) 0deg, var(--third-color) 0deg)`;
  }

  addEventListeners() {
    this.timerControl.addEventListener("click", () => {
      this.toggleTimerControlState();
      this.timerControl.innerHTML = this.timerControlState;
      if (this.timerControlState === "pause") {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    });

    this.pomodoroOption.addEventListener("click", () =>
      this.handleOptionClick(
        this.pomodoroOption,
        "pomodoro",
        this.times.pomodoro
      )
    );
    this.shortOption.addEventListener("click", () =>
      this.handleOptionClick(this.shortOption, "short", this.times.short)
    );
    this.longOption.addEventListener("click", () =>
      this.handleOptionClick(this.longOption, "long", this.times.long)
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const pomodoro = new PomodoroTimer();
  console.log(`Pomodoro actual: ${pomodoro.currentPomodoro}`);
  console.log(`Estado actual: ${pomodoro.state}`);
});
