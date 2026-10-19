
import { esc } from '../ui.js';
import { storyClock } from '../story-clock.js';
import { ClockStore } from './store.js';

// ==========================================
// 시간 표시
// ==========================================

const duration = (ms, watch = false) => {
  const cs = Math.floor(Math.max(0, ms) / 10);
  const s = Math.floor(cs / 100) % 60;
  const m = Math.floor(cs / 6000) % 60;
  const h = Math.floor(cs / 360000);

  if (watch) {
    return (
      (h ? String(h).padStart(2, '0') + ':' : '') +
      String(h ? m : Math.floor(cs / 6000)).padStart(2, '0') +
      ':' +
      String(s).padStart(2, '0') +
      '.' +
      String(cs % 100).padStart(2, '0')
    );
  }

  return (
    String(h).padStart(2, '0') + ':' +
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0')
  );
};

// ==========================================
// 하단 탭 아이콘
// ==========================================

const tabIcon = id => {
  const icons = {
    world:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M3 12h18M12 3q-8 9 0 18 8-9 0-18Z"/>',

    alarms:
      '<circle cx="12" cy="13" r="8"/>' +
      '<path d="M12 8v5l3 2M3 4l4-2m10 0 4 2M6 21l-2 2m14-2 2 2"/>',

    stopwatch:
      '<circle cx="12" cy="14" r="8"/>' +
      '<path d="M12 2v4M9 2h6m-3 12 4-4M18 6l2-2"/>',

    timer:
      '<circle cx="12" cy="13" r="9"/>' +
      '<path d="M12 4v9l4 3M9 1h6"/>'
  };

  return `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      aria-hidden="true"
    >${icons[id] || ''}</svg>
  `;
};

// ==========================================
// 시계 앱
// ==========================================

export class ClockApp {

  constructor(screen, h) {
    this.screen = screen;
    this.h = h;
    this.store = new ClockStore(h.notify);
    this.dirty = false;

    // --------------------------------------
    // 버튼 클릭
    // --------------------------------------

    screen.addEventListener('click', e => {
      const b = e.target.closest('[data-clock]');

      if (
        !b ||
        b.closest('.motion-previous') ||
        this.h.active() !== 'clock' ||
        h.busy()
      ) {
        return;
      }

      const action = b.dataset.clock;
      const s = this.store;

      if (action === 'tab') {
        this.h.root({
          tab: b.dataset.id,
          detail: null
        });
        return;
      }

      if (action === 'alarm-toggle') {
        const alarm = s.alarms.find(a => a.id === b.dataset.id);

        if (alarm) {
          alarm.enabled = !alarm.enabled;
        }
      }

      if (action === 'watch-start') s.startWatch();
      if (action === 'watch-pause') s.pauseWatch();
      if (action === 'watch-reset') s.resetWatch();

      if (action === 'timer-pause') s.pauseTimer();
      if (action === 'timer-resume') s.resumeTimer();
      if (action === 'timer-cancel') s.cancelTimer();

      this.h.refresh();
    });

    // --------------------------------------
    // 알람 / 타이머 등록
    // --------------------------------------

    screen.addEventListener('submit', e => {
      const form = e.target;

      if (
        !form.matches('[data-clock-form]') ||
        this.h.active() !== 'clock'
      ) {
        return;
      }

      e.preventDefault();

      if (h.busy()) return;

      const data = new FormData(form);

      if (form.dataset.clockForm === 'alarm') {
        const alarmTime = String(data.get('alarm-time') || '');
        const alarmLabel = String(data.get('alarm-label') || '');

        if (!this.store.addAlarm(alarmTime, alarmLabel)) {
          return;
        }

      } else {
        const hours = Number(data.get('hours'));
        const minutes = Number(data.get('minutes'));
        const seconds = Number(data.get('seconds'));

        const valid =
          [hours, minutes, seconds].every(Number.isInteger) &&
          hours >= 0 && hours <= 23 &&
          minutes >= 0 && minutes <= 59 &&
          seconds >= 0 && seconds <= 59;

        if (!valid) return;

        const totalMs =
          (hours * 3600 + minutes * 60 + seconds) * 1000;

        if (!this.store.startTimer(totalMs)) {
          return;
        }
      }

      h.refresh();
    });
  }

  // ========================================
  // 시계 갱신
  // ========================================

  tick() {
    const changed = this.store.tick();

    this.dirty = this.dirty || changed;

    if (
      this.h.active() !== 'clock' ||
      this.h.busy()
    ) {
      return;
    }

    if (this.dirty) {
      this.dirty = false;
      this.h.refresh();
      return;
    }

    // 세계 시계 시간
    this.screen.querySelectorAll('[data-city-time]').forEach(element => {
      const city = this.store.cities.find(
        c => c.id === element.dataset.cityTime
      );

      if (!city) return;

      try {
        element.textContent = storyClock.time(
          undefined,
          city.timeZone
        );
      } catch {
        element.textContent = '시간대 오류';
      }
    });

    // 세계 시계 날짜
    this.screen.querySelectorAll('[data-city-date]').forEach(element => {
      const city = this.store.cities.find(
        c => c.id === element.dataset.cityDate
      );

      if (!city) return;

      try {
        element.textContent = storyClock.date(
          undefined,
          city.timeZone
        );
      } catch {
        element.textContent = '시간대 오류';
      }
    });

    // 스톱워치
    const watch = this.screen.querySelector('#stopwatch-time');

    if (watch) {
      watch.textContent = duration(
        this.store.stopwatchMs(),
        true
      );
    }

    // 타이머
    const timer = this.screen.querySelector('#timer-time');

    if (timer) {
      timer.textContent = duration(
        Math.ceil(this.store.timerMs() / 1000) * 1000
      );
    }
  }

  // ========================================
  // 세계 시계
  // ========================================

  renderWorld() {
    const cities = this.store.cities.map(city => {
      try {
        return `
          <section>
            <div>
              <h3>${esc(city.name)}</h3>

              <p data-city-date="${esc(city.id)}">${esc(
                storyClock.date(undefined, city.timeZone)
              )}</p>

              <small>${esc(city.timeZone)}</small>
            </div>

            <time data-city-time="${esc(city.id)}">${esc(
              storyClock.time(undefined, city.timeZone)
            )}</time>
          </section>
        `;
      } catch {
        return `
          <p>
            ${esc(city.name)} · 잘못된 시간대 설정
          </p>
        `;
      }
    }).join('');

    return `
      <h2>세계 시계</h2>
      <div class="world-cities">
        ${cities}
      </div>
    `;
  }

  // ========================================
  // 알람
  // ========================================

  renderAlarms() {
    const alarms = this.store.alarms.map(alarm => `
      <section class="${alarm.enabled ? '' : 'disabled'}">
        <div>
          <time>${esc(alarm.time)}</time>
          <p>${esc(alarm.label)}</p>
        </div>

        <button
          class="switch ${alarm.enabled ? 'on' : ''}"
          role="switch"
          aria-checked="${alarm.enabled}"
          aria-label="${esc(alarm.time + ' ' + alarm.label)}"
          data-clock="alarm-toggle"
          data-id="${esc(alarm.id)}"
        ></button>
      </section>
    `).join('');

    return `
      <h2>알람</h2>

      <div class="clock-alarms">
        ${alarms}
      </div>

      <form
        class="clock-alarm-form"
        data-clock-form="alarm"
      >
        <h3>알람 추가</h3>

        <label>
          시간
          <input
            type="time"
            name="alarm-time"
            required
            value="10:00"
          >
        </label>

        <label>
          레이블
          <input
            name="alarm-label"
            maxlength="100"
            placeholder="알람"
          >
        </label>

        <button type="submit">추가</button>
      </form>
    `;
  }

  // ========================================
  // 스톱워치
  // ========================================

  renderStopwatch() {
    const s = this.store;

    const control = s.stopwatch.startedAt === null
      ? `
        <button
          class="green"
          data-clock="watch-start"
        >${s.stopwatch.elapsed ? '재개' : '시작'}</button>
      `
      : `
        <button
          class="red"
          data-clock="watch-pause"
        >일시정지</button>
      `;

    return `
      <h2>스톱워치</h2>

      <div class="clock-measure">
        <output id="stopwatch-time">${duration(
          s.stopwatchMs(),
          true
        )}</output>

        <div class="clock-round-controls">
          <button
            class="neutral"
            data-clock="watch-reset"
          >초기화</button>

          ${control}
        </div>
      </div>
    `;
  }

  // ========================================
  // 타이머
  // ========================================

  renderTimer() {
    const s = this.store;

    // 타이머 설정 화면
    if (s.timer.state === 'idle') {
      const fields = [
        ['hours', '시간', 23],
        ['minutes', '분', 59],
        ['seconds', '초', 59]
      ].map(([id, label, max]) => `
        <label>
          <input
            type="number"
            name="${id}"
            min="0"
            max="${max}"
            step="1"
            inputmode="numeric"
            value="${s.defaults[id]}"
            required
          >
          <span>${label}</span>
        </label>
      `).join('');

      return `
        <h2>타이머</h2>

        <form
          data-clock-form="timer"
          class="clock-timer-form"
        >
          <div>${fields}</div>

          <button
            type="submit"
            class="green"
          >시작</button>
        </form>
      `;
    }

    // 타이머 실행 화면
    const stateText =
      s.timer.state === 'finished'
        ? '타이머 종료'
        : s.timer.state === 'paused'
          ? '일시정지'
          : '남은 시간';

    const pauseResume =
      s.timer.state === 'running'
        ? `
          <button
            class="orange"
            data-clock="timer-pause"
          >일시정지</button>
        `
        : s.timer.state === 'paused'
          ? `
            <button
              class="green"
              data-clock="timer-resume"
            >재개</button>
          `
          : '';

    return `
      <h2>타이머</h2>

      <div class="clock-measure">
        <output id="timer-time">${duration(
          Math.ceil(s.timerMs() / 1000) * 1000
        )}</output>

        <p
          class="clock-timer-state"
          role="status"
        >${stateText}</p>

        <div class="clock-round-controls">
          <button
            class="neutral"
            data-clock="timer-cancel"
          >${s.timer.state === 'finished' ? '완료' : '취소'}</button>

          ${pauseResume}
        </div>
      </div>
    `;
  }

  // ========================================
  // 하단 탭
  // ========================================

  renderTabs(activeTab) {
    const tabs = [
      ['world', '세계 시계'],
      ['alarms', '알람'],
      ['stopwatch', '스톱워치'],
      ['timer', '타이머']
    ];

    return `
      <nav class="clock-tabs">
        ${tabs.map(([id, title]) => `
          <button
            data-clock="tab"
            data-id="${id}"
            aria-current="${activeTab === id ? 'page' : 'false'}"
          >
            <span aria-hidden="true">${tabIcon(id)}</span>
            ${title}
          </button>
        `).join('')}
      </nav>
    `;
  }

  // ========================================
  // 전체 화면 렌더링
  // ========================================

  render(route) {
    const tab = ['alarms', 'stopwatch', 'timer'].includes(route.tab)
      ? route.tab
      : 'world';

    let body = '';

    if (tab === 'world') {
      body = this.renderWorld();
    }

    if (tab === 'alarms') {
      body = this.renderAlarms();
    }

    if (tab === 'stopwatch') {
      body = this.renderStopwatch();
    }

    if (tab === 'timer') {
      body = this.renderTimer();
    }

    return this.h.shell(
      'clock',
      '시계',
      body,
      this.renderTabs(tab)
    );
  }
}
