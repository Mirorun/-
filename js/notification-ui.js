
import {esc} from './ui.js';
import {displayName} from './messages/story-rules.js';

function timeLabel(time) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - time) / 60000)
  );

  return minutes === 0 ? '지금' : `${minutes}분 전`;
}

export class NotificationUI {
  constructor(
    phone,
    screen,
    store,
    {open, reset, announce, visibility = () => {}}
  ) {
    this.visibility = visibility;
    this.phone = phone;
    this.screen = screen;
    this.store = store;
    this.open = open;
    this.reset = reset;
    this.announce = announce;

    this.centerOpen = false;
    this.bannerId = null;
    this.bannerTimer = null;
    this.mode = 'lock';

    // 마지막 알림이 도착한 뒤 배너를 유지할 시간
    this.bannerDuration = 3000;

    this.host = document.createElement('div');
    this.host.className = 'notifications-layer';
    phone.append(this.host);

    this.host.innerHTML = `
      <div class="lock-notification-list"></div>
      <div class="banner-stack"></div>
      <section
        class="notification-center"
        role="dialog"
        aria-modal="true"
        aria-label="알림 센터"
        hidden
      ></section>
    `;

    this.lockList = this.host.querySelector(
      '.lock-notification-list'
    );

    this.bannerStack = this.host.querySelector(
      '.banner-stack'
    );

    this.center = this.host.querySelector(
      '.notification-center'
    );

    this.host.addEventListener('click', e => {
      const b = e.target.closest('[data-notice-action]');
      if (!b) return;

      const action = b.dataset.noticeAction;
      const id = b.dataset.eventId;

      if (action === 'open') {
        this.closeCenter();
        this.dismissBanner(false);
        this.open(id);
      }

      else if (action === 'delete') {
        this.store.remove(id);

        if (this.bannerId === id) {
          this.dismissBanner(false);
        }
      }

      else if (action === 'dismiss') {
        this.dismissBanner(false);
      }

      else if (action === 'close') {
        this.closeCenter();
      }

      else if (action === 'reset') {
        this.reset();
      }
    });

    this.center.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;

      const all = [
        ...this.center.querySelectorAll('button')
      ];

      if (!all.length) return;

      const first = all[0];
      const last = all.at(-1);

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }

      else if (
        !e.shiftKey &&
        document.activeElement === last
      ) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  card(event, {removable = false, banner = false} = {}) {
    return `
      <article
        class="notice-card ${event.read ? 'notice-read' : ''}"
        data-notification-id="${esc(event.id)}"
      >
        <button
          class="notice-main"
          data-notice-action="open"
          data-event-id="${esc(event.id)}"
        >
          <img
            src="assets/icons/${
              event.appId === 'clock' ? 'clock' :
              event.appId === 'kakao' ? 'kakao' :
              event.appId === 'messages' ? 'messages' :
              event.appId === 'calendar' ? 'calendar' :
              'phone'
            }.svg"
            alt=""
          >

          <span class="notice-copy">
            <span class="notice-heading">
              <strong>${esc(event.appId === 'messages' ? displayName(event.senderName) : event.senderName)}</strong>

              <time datetime="${
                new Date(event.firedAt).toISOString()
              }">
                ${timeLabel(event.firedAt)}
              </time>
            </span>

            <span class="notice-message">
              ${esc(event.appId === 'messages' ? displayName(event.message) : event.message)}
            </span>

            ${
              event.read
                ? '<span class="notice-read-label">읽음</span>'
                : ''
            }
          </span>
        </button>

        ${
          removable
            ? `<button
                 class="notice-remove"
                 data-notice-action="delete"
                 data-event-id="${esc(event.id)}"
                 aria-label="${esc(event.senderName)} 알림 삭제"
               >×</button>`
            : ''
        }

        ${
          banner
            ? `<button
                 class="notice-remove"
                 data-notice-action="dismiss"
                 aria-label="배너 닫기"
               >×</button>`
            : ''
        }
      </article>
    `;
  }

  // ─────────────────────────────────────
  // 알림 상태 동기화
  // ─────────────────────────────────────

  sync(mode, busy = false) {
    this.mode = mode;

    if (this.suspended) {
      this.lockList.innerHTML = '';
      this.dismissBanner(false);
      return;
    }

    const records = this.store
      .records()
      .filter(e => !e.silent);

    // 잠금 화면 알림 목록
    this.lockList.innerHTML =
      mode === 'lock' && !this.centerOpen
        ? records
            .filter(e => !e.read)
            .map(e => this.card(e))
            .join('')
        : '';

    // PIN 화면
    if (mode === 'pin') {
      this.dismissBanner(false);
      this.lockList.innerHTML = '';

      if (this.centerOpen) {
        this.closeCenter();
      }

      return;
    }

    // 알림 센터가 열려 있을 때
    if (this.centerOpen) {
      this.renderCenter();

      for (const e of records) {
        if (e.pending) {
          this.store.presented(e.id);
        }
      }

      return;
    }

    // 잠금 화면에서는 상단 배너 대신
    // 기존 잠금 화면 알림 목록 사용
    if (mode === 'lock') {
      this.dismissBanner(false);

      for (const e of records) {
        if (e.pending) {
          this.store.presented(e.id);
        }
      }

      return;
    }

    // 이미 표시 중인 알림이 삭제되거나
    // 읽음 처리되었다면 배너 제거
    if (
      this.bannerId &&
      !records.some(
        e => e.id === this.bannerId && !e.read
      )
    ) {
      this.dismissBanner(false);
    }

    // ─────────────────────────────────
    // 핵심 변경:
    // 새로운 알림이 있으면 기존 배너가
    // 표시 중이어도 즉시 최신 알림으로 교체
    // ─────────────────────────────────

    const pending = records.filter(
      e => e.pending && !e.read
    );

    if (pending.length > 0) {
      // 도착 시각이 가장 최근인 알림 선택
      const newest = pending.reduce(
        (latest, current) => {
          if (!latest) return current;

          return current.firedAt >= latest.firedAt
            ? current
            : latest;
        },
        null
      );

      // 밀려 있는 알림을 나중에 다시
      // 배너로 띄우지 않도록 표시 처리
      for (const e of pending) {
        if (e.id !== newest.id) {
          this.store.presented(e.id);
        }
      }

      // 기존 배너를 기다리지 않고 교체
      this.showBanner(newest);
    }
  }

  // ─────────────────────────────────────
  // 최신 알림으로 즉시 갱신
  // ─────────────────────────────────────

  showBanner(event) {
    // 이전 배너 종료 타이머 취소
    clearTimeout(this.bannerTimer);
    this.bannerTimer = null;

    // 현재 배너 ID를 새 알림으로 변경
    this.bannerId = event.id;

    // 기존 알림창을 즉시 새 알림으로 교체
    this.bannerStack.innerHTML = this.card(
      event,
      {banner: true}
    );

    // 알림 센터에는 기록 유지
    this.store.presented(event.id);

    // 접근성 알림
    this.announce(
      event.appId === 'messages' ? displayName(`${event.senderName}의 메시지: ${event.message}`) : `${event.senderName}의 메시지: ${event.message}`
    );

    // 마지막 알림 도착 시점부터 3초
    this.bannerTimer = setTimeout(() => {
      this.dismissBanner();
    }, this.bannerDuration);
  }

  // ─────────────────────────────────────
  // 배너 닫기
  // ─────────────────────────────────────

  dismissBanner(animated = true) {
    clearTimeout(this.bannerTimer);
    this.bannerTimer = null;

    const node = this.bannerStack.firstElementChild;

    this.bannerId = null;

    if (!node) return;

    // 기존 알림이 사라지는 애니메이션 유지
    if (
      animated &&
      node.animate &&
      !matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      node.style.pointerEvents = 'none';

      const animation = node.animate(
        [
          {
            opacity: 1,
            transform: 'translateY(0)'
          },
          {
            opacity: 0,
            transform: 'translateY(-110%)'
          }
        ],
        {
          duration: 200,
          easing: 'ease-in',
          fill: 'forwards'
        }
      );

      animation.finished
        .catch(() => {})
        .finally(() => {
          // 새 알림이 도착해 교체되었다면
          // 새 배너를 삭제하지 않음
          if (node.isConnected) {
            node.remove();
          }
        });
    }

    else {
      this.bannerStack.replaceChildren();
    }
  }

  // ─────────────────────────────────────
  // 알림 센터
  // ─────────────────────────────────────

  renderCenter() {
    const content = `
      <header class="center-toolbar">
        <h2>알림 센터</h2>
        <button
          data-notice-action="close"
          aria-label="알림 센터 닫기"
        >완료</button>
      </header>

      <div class="center-records">
        ${
          this.store
            .records()
            .filter(e => !e.silent)
            .map(e => this.card(e, {removable: true}))
            .join('')
          ||
          '<p class="center-empty">새로운 알림이 없습니다.</p>'
        }
      </div>

      <div class="center-footer">
        <button data-notice-action="reset">
          테스트 알림 초기화
        </button>

        <p>
          이번 접속에서만 유지됩니다.
          새로고침하면 처음부터 시작합니다.
        </p>
      </div>
    `;

    if (this.center.innerHTML !== content) {
      const focused = document.activeElement;
      const action = focused?.dataset.noticeAction;
      const eventId = focused?.dataset.eventId;

      this.center.innerHTML = content;

      if (action) {
        [
          ...this.center.querySelectorAll('button')
        ]
          .find(
            b =>
              b.dataset.noticeAction === action &&
              b.dataset.eventId === eventId
          )
          ?.focus({preventScroll: true});
      }
    }
  }

  openCenter() {
    if (this.mode === 'pin') return;

    this.previousFocus = document.activeElement;
    this.centerOpen = true;

    this.dismissBanner(false);

    this.center.hidden = false;
    this.screen.inert = true;

    this.renderCenter();

    this.center
      .querySelector('button')
      .focus({preventScroll: true});

    this.sync(this.mode);
    this.visibility();
  }

  closeCenter() {
    if (!this.centerOpen) return;

    this.centerOpen = false;
    this.center.hidden = true;
    this.screen.inert = false;

    if (this.previousFocus?.isConnected) {
      this.previousFocus.focus({
        preventScroll: true
      });
    }

    this.sync(this.mode);
    this.visibility();
  }
}
