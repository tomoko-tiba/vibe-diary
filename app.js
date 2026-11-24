/* ==========================================================================
   Vibe Diary — Local-First Daily Atmosphere & Mood Journal
   Zero dependencies · Stores entries privately in browser localStorage
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'vibe-diary-entries-v1';
  const DRAFT_KEY = 'vibe-diary-draft-v1';
  const PREFS_KEY = 'vibe-diary-prefs-v1';

  const VIBES = [
    {
      id: 'golden',
      color: '#c87d4b',
      tint: 'rgba(200, 125, 75, 0.14)',
      glowLight: 'rgba(200, 125, 75, 0.09)',
      glowDark: 'rgba(200, 125, 75, 0.14)',
      en: 'Golden Hour',
      zh: '落日余晖',
    },
    {
      id: 'calm',
      color: '#5b7a74',
      tint: 'rgba(91, 122, 116, 0.14)',
      glowLight: 'rgba(91, 122, 116, 0.09)',
      glowDark: 'rgba(91, 122, 116, 0.14)',
      en: 'Rainy Calm',
      zh: '雨后静谧',
    },
    {
      id: 'focus',
      color: '#486581',
      tint: 'rgba(72, 101, 129, 0.14)',
      glowLight: 'rgba(72, 101, 129, 0.09)',
      glowDark: 'rgba(72, 101, 129, 0.15)',
      en: 'Crisp Focus',
      zh: '清醒专注',
    },
    {
      id: 'tender',
      color: '#b87a7a',
      tint: 'rgba(184, 122, 122, 0.14)',
      glowLight: 'rgba(184, 122, 122, 0.09)',
      glowDark: 'rgba(184, 122, 122, 0.14)',
      en: 'Soft & Tender',
      zh: '柔软微暖',
    },
    {
      id: 'drift',
      color: '#8a8168',
      tint: 'rgba(138, 129, 104, 0.15)',
      glowLight: 'rgba(138, 129, 104, 0.09)',
      glowDark: 'rgba(138, 129, 104, 0.14)',
      en: 'Slow Drift',
      zh: '慢速漫游',
    },
    {
      id: 'spark',
      color: '#b8933e',
      tint: 'rgba(184, 147, 62, 0.15)',
      glowLight: 'rgba(184, 147, 62, 0.09)',
      glowDark: 'rgba(184, 147, 62, 0.14)',
      en: 'Sunlit Spark',
      zh: '灵感乍现',
    },
    {
      id: 'still',
      color: '#606068',
      tint: 'rgba(96, 96, 104, 0.15)',
      glowLight: 'rgba(96, 96, 104, 0.08)',
      glowDark: 'rgba(140, 140, 152, 0.13)',
      en: 'Late Stillness',
      zh: '深夜沉思',
    },
  ];

  const VIBE_MAP = Object.fromEntries(VIBES.map((v) => [v.id, v]));

  const COPY = {
    en: {
      brand: 'Vibe Diary',
      langSwitch: '中文',
      backup: 'Backup',
      greetingMorning: ['Good morning — ', "what's the vibe?"],
      greetingAfternoon: ['Pause a moment — ', 'how does today feel?'],
      greetingEvening: ['Evening light — ', "capture today's vibe."],
      greetingNight: ['Late stillness — ', 'what lingers tonight?'],
      subtitle:
        'A quiet, private notebook in your browser for the light, sounds, and moods that shape each day.',
      stripEmpty: 'Your recent atmosphere swatches will appear here.',
      entriesCount: (n) => (n === 1 ? '1 entry' : `${n} entries`),
      streakLabel: (n) => `${n}d streak`,
      editingBanner: (dateStr) => `Editing entry from ${dateStr}`,
      cancelEdit: 'Cancel',
      titlePlaceholder: 'Give this moment a title (optional)...',
      bodyPlaceholder: 'Write down the light, the sounds, the small thoughts lingering today...',
      musicPlaceholder: 'Listening to...',
      placePlaceholder: 'Where you are...',
      photoBtn: 'Photo',
      photoAdded: 'Change photo',
      saveEntry: 'Save Entry',
      updateEntry: 'Update Entry',
      wordCount: (n) => (n === 1 ? '1 word' : `${n} words`),
      draftSaved: 'Draft saved',
      archiveHeading: 'Journal Archive',
      searchPlaceholder: 'Search notes, places, songs...',
      filterAll: 'All',
      sampleBadge: 'Sample',
      edit: 'Edit',
      delete: 'Delete',
      emptyNoEntriesTitle: 'An open first page.',
      emptyNoEntriesDesc: 'Pick a vibe above and jot down one small detail from today.',
      emptyFilteredTitle: 'Nothing matches that filter.',
      emptyFilteredDesc: 'Try clearing your search or switching back to all vibes.',
      footerPrivacy: 'Stored locally in your browser · No accounts, no tracking.',
      footerShortcuts: 'Shortcuts: ⌘↵ save · / search · Esc close',
      backupTitle: 'Backup & Portability',
      backupDesc:
        'All entries stay privately on this device. Export a backup anytime, or download your diary as a clean Markdown book.',
      exportJson: 'Export JSON',
      exportMd: 'Export Markdown',
      importJson: 'Import JSON Backup',
      clearSamples: 'Remove sample entries',
      toastSaved: 'Entry saved to your diary.',
      toastUpdated: 'Entry updated.',
      toastDeleted: 'Entry deleted.',
      toastUndo: 'Undo',
      toastRestored: 'Entry restored.',
      toastExportedJson: 'JSON backup downloaded.',
      toastExportedMd: 'Markdown diary downloaded.',
      toastImported: (n) => (n === 1 ? 'Imported 1 entry.' : `Imported ${n} entries.`),
      toastImportErr: 'Could not read that backup file.',
      toastSamplesCleared: 'Sample entries removed.',
      toastStorageFull: 'Browser storage is full. Try exporting a backup or removing a photo.',
      toastPhotoErr: 'Could not load that image.',
      untitled: 'Untitled moment',
    },
    zh: {
      brand: 'Vibe 日记',
      langSwitch: 'EN',
      backup: '备份',
      greetingMorning: ['早安，', '今天是什么氛围？'],
      greetingAfternoon: ['停下片刻，', '此刻是什么感觉？'],
      greetingEvening: ['暮色渐浓，', '记下今天的氛围。'],
      greetingNight: ['深夜静谧，', '今夜留下了什么？'],
      subtitle: '留在浏览器本地的安静日记本，记录每一天的光线、旋律与情绪温度。',
      stripEmpty: '写下日记后，最近几天的氛围色带会出现在这里。',
      entriesCount: (n) => `${n} 篇日记`,
      streakLabel: (n) => `连续 ${n} 天`,
      editingBanner: (dateStr) => `正在编辑 ${dateStr} 的日记`,
      cancelEdit: '取消编辑',
      titlePlaceholder: '给这一刻起个标题（可选）...',
      bodyPlaceholder: '写下今天的光线、听到的声音，或是脑海里停留的小念头...',
      musicPlaceholder: '正在听的歌...',
      placePlaceholder: '所在的角落...',
      photoBtn: '配图',
      photoAdded: '更换配图',
      saveEntry: '保存日记',
      updateEntry: '更新日记',
      wordCount: (n) => `${n} 字`,
      draftSaved: '草稿已暂存',
      archiveHeading: '日记归档',
      searchPlaceholder: '搜索文字、地点或歌曲...',
      filterAll: '全部',
      sampleBadge: '示例',
      edit: '编辑',
      delete: '删除',
      emptyNoEntriesTitle: '空白的第一页。',
      emptyNoEntriesDesc: '选一个当下的氛围色，写下今天值得记住的一件小事。',
      emptyFilteredTitle: '没有找到匹配的日记。',
      emptyFilteredDesc: '试试清空搜索词，或切回「全部」氛围。',
      footerPrivacy: '数据仅保存在你的浏览器本地 · 无需账号，无追踪。',
      footerShortcuts: '快捷键：⌘↵ 保存 · / 搜索 · Esc 关闭',
      backupTitle: '备份与导出',
      backupDesc:
        '你的所有记录都私密保存在当前浏览器中。可以随时导出 JSON 完整备份，或导出为整洁的 Markdown 日记本。',
      exportJson: '导出 JSON',
      exportMd: '导出 Markdown',
      importJson: '导入 JSON 备份',
      clearSamples: '清除示例日记',
      toastSaved: '日记已保存。',
      toastUpdated: '日记已更新。',
      toastDeleted: '已删除该日记。',
      toastUndo: '撤销',
      toastRestored: '已恢复日记。',
      toastExportedJson: '已下载 JSON 备份。',
      toastExportedMd: '已下载 Markdown 日记。',
      toastImported: (n) => `成功导入 ${n} 篇日记。`,
      toastImportErr: '无法解析该备份文件，请确认格式正确。',
      toastSamplesCleared: '示例日记已清除。',
      toastStorageFull: '浏览器存储空间不足，建议先导出备份或减少大图。',
      toastPhotoErr: '图片读取失败，请换一张试试。',
      untitled: '无题时刻',
    },
  };

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */

  const $ = (id) => document.getElementById(id);

  function toLocalDateStr(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function daysAgoStr(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return toLocalDateStr(d);
  }

  function parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  function formatHeaderDate(lang) {
    const now = new Date();
    if (lang === 'zh') {
      return now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      });
    }
    return now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }

  function formatMonthHeading(monthKey, lang) {
    const [y, m] = monthKey.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    if (lang === 'zh') {
      return `${y} 年 ${m} 月`;
    }
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  function formatEntryDate(dateStr, createdAt, lang) {
    const d = parseLocalDate(dateStr);
    const dayNum = String(d.getDate()).padStart(2, '0');
    const weekday = d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      weekday: 'short',
    });
    const timePart = createdAt
      ? new Date(createdAt).toLocaleTimeString(lang === 'zh' ? 'zh-CN' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '';
    return lang === 'zh'
      ? `${d.getMonth() + 1}月${dayNum}日 ${weekday}${timePart ? ` · ${timePart}` : ''}`
      : `${dayNum} ${weekday.toUpperCase()}${timePart ? ` · ${timePart}` : ''}`;
  }

  function countWordsAndChars(text, lang) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    const cjkMatches = trimmed.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) || [];
    const withoutCjk = trimmed.replace(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g, ' ');
    const latinWords = withoutCjk.trim() ? withoutCjk.trim().split(/\s+/).length : 0;
    return lang === 'zh' ? cjkMatches.length + latinWords : cjkMatches.length + latinWords;
  }

  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `vd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function createStarterEntries() {
    const now = Date.now();
    return [
      {
        id: 'sample-golden-hour',
        date: daysAgoStr(0),
        createdAt: now - 1000 * 60 * 90,
        vibe: 'golden',
        title: 'Amber light across the desk',
        body: 'Late afternoon sun slid across the wooden desk right as the kettle clicked off. Left the laptop closed for twenty minutes and just watched dust drift through the warm strip of light.\n\nSmall reminder: a good day rarely needs a big reason.',
        music: 'Ryuichi Sakamoto — Aqua',
        place: 'Window desk',
        photo: null,
        isSample: true,
      },
      {
        id: 'sample-rainy-calm',
        date: daysAgoStr(1),
        createdAt: now - 1000 * 60 * 60 * 27,
        vibe: 'calm',
        title: 'Slow drizzle after 6 PM',
        body: 'Walked home with no umbrella because the rain was more mist than drops. The streetlights reflected softly on the wet pavement, and everything felt turned down to half volume.',
        music: 'Nujabes — Reflection Eternal',
        place: 'Cedar Street walk',
        photo: null,
        isSample: true,
      },
      {
        id: 'sample-crisp-focus',
        date: daysAgoStr(3),
        createdAt: now - 1000 * 60 * 60 * 74,
        vibe: 'focus',
        title: 'Clean start, one clear thing',
        body: 'Cleared the desktop, made a pour-over, and finished the stubborn problem that had been sitting in the back of my mind all week. Quiet momentum feels better than rushing.',
        music: 'Brian Eno — Music for Airports',
        place: 'Corner coffee shop',
        photo: null,
        isSample: true,
      },
    ];
  }

  function calculateStreak(entries) {
    if (!entries.length) return 0;
    const uniqueDates = new Set(entries.map((e) => e.date));
    const today = toLocalDateStr(new Date());
    const yesterday = daysAgoStr(1);

    let cursor = uniqueDates.has(today) ? 0 : uniqueDates.has(yesterday) ? 1 : -1;
    if (cursor === -1) return 0;

    let streak = 0;
    while (uniqueDates.has(daysAgoStr(cursor))) {
      streak += 1;
      cursor += 1;
    }
    return streak;
  }

  /* ------------------------------------------------------------------------
     State & Persistence
     ------------------------------------------------------------------------ */

  const state = {
    entries: [],
    prefs: {
      lang: 'en',
      theme: 'day',
    },
    selectedVibe: 'golden',
    filterVibe: 'all',
    searchQuery: '',
    editingId: null,
    pendingPhoto: null,
    activeReaderId: null,
    lastDeleted: null,
    toastTimer: null,
    draftTimer: null,
  };

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lang === 'zh' || parsed.lang === 'en') state.prefs.lang = parsed.lang;
        if (parsed.theme === 'evening' || parsed.theme === 'day') state.prefs.theme = parsed.theme;
      }
    } catch {
      // Ignore corrupted prefs
    }
  }

  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(state.prefs));
    } catch {
      // Ignore storage errors
    }
  }

  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        state.entries = createStarterEntries();
        saveEntries();
      } else {
        const parsed = JSON.parse(raw);
        state.entries = Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      state.entries = [];
    }
  }

  function saveEntries() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
      return true;
    } catch {
      showToast(t().toastStorageFull);
      return false;
    }
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.vibe && VIBE_MAP[draft.vibe]) state.selectedVibe = draft.vibe;
      if (draft.title) $('entry-title-input').value = draft.title;
      if (draft.body) $('entry-body-input').value = draft.body;
      if (draft.music) $('entry-music-input').value = draft.music;
      if (draft.place) $('entry-place-input').value = draft.place;
      if (draft.date) $('entry-date-input').value = draft.date;
    } catch {
      // Ignore draft errors
    }
  }

  function persistDraft() {
    if (state.editingId) return;
    const draft = {
      vibe: state.selectedVibe,
      title: $('entry-title-input').value,
      body: $('entry-body-input').value,
      music: $('entry-music-input').value,
      place: $('entry-place-input').value,
      date: $('entry-date-input').value,
    };
    const hasContent = draft.title.trim() || draft.body.trim() || draft.music.trim() || draft.place.trim();
    try {
      if (hasContent) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        const statusEl = $('draft-status');
        statusEl.textContent = t().draftSaved;
        statusEl.classList.add('visible');
        clearTimeout(state.draftTimer);
        state.draftTimer = setTimeout(() => {
          statusEl.classList.remove('visible');
        }, 1800);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch {
      // Ignore draft storage failures
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore
    }
  }

  function t() {
    return COPY[state.prefs.lang];
  }

  function vibeLabel(vibeId) {
    const v = VIBE_MAP[vibeId] || VIBES[0];
    return state.prefs.lang === 'zh' ? v.zh : v.en;
  }

  /* ------------------------------------------------------------------------
     Theme & Ambient Vibe Updates
     ------------------------------------------------------------------------ */

  function applyTheme() {
    const isEvening = state.prefs.theme === 'evening';
    document.documentElement.dataset.theme = isEvening ? 'evening' : 'day';
    $('theme-icon-moon').toggleAttribute('hidden', isEvening);
    $('theme-icon-sun').toggleAttribute('hidden', !isEvening);
    applyActiveVibeAtmosphere();
  }

  function applyActiveVibeAtmosphere() {
    const vibe = VIBE_MAP[state.selectedVibe] || VIBES[0];
    const isEvening = state.prefs.theme === 'evening';
    document.documentElement.style.setProperty('--active-vibe-color', vibe.color);
    document.documentElement.style.setProperty(
      '--active-vibe-glow',
      isEvening ? vibe.glowDark : vibe.glowLight
    );
  }

  /* ------------------------------------------------------------------------
     Rendering
     ------------------------------------------------------------------------ */

  function renderGreeting() {
    const hour = new Date().getHours();
    const copy = t();
    let parts;
    if (hour >= 5 && hour < 12) parts = copy.greetingMorning;
    else if (hour >= 12 && hour < 18) parts = copy.greetingAfternoon;
    else if (hour >= 18 && hour < 23) parts = copy.greetingEvening;
    else parts = copy.greetingNight;

    const heading = $('masthead-heading');
    heading.textContent = '';
    heading.append(document.createTextNode(parts[0]));
    const em = document.createElement('em');
    em.textContent = parts[1];
    heading.append(em);
  }

  function renderStaticCopy() {
    const copy = t();
    document.documentElement.lang = state.prefs.lang === 'zh' ? 'zh-CN' : 'en';
    $('brand-name').textContent = copy.brand;
    $('header-date').textContent = formatHeaderDate(state.prefs.lang);
    $('lang-toggle-btn').textContent = copy.langSwitch;
    $('backup-btn-label').textContent = copy.backup;
    $('masthead-subtitle').textContent = copy.subtitle;
    $('entry-title-input').placeholder = copy.titlePlaceholder;
    $('entry-body-input').placeholder = copy.bodyPlaceholder;
    $('entry-music-input').placeholder = copy.musicPlaceholder;
    $('entry-place-input').placeholder = copy.placePlaceholder;
    $('photo-attach-text').textContent = state.pendingPhoto ? copy.photoAdded : copy.photoBtn;
    $('save-btn-label').textContent = state.editingId ? copy.updateEntry : copy.saveEntry;
    $('editing-cancel-btn').textContent = copy.cancelEdit;
    $('archive-heading').textContent = copy.archiveHeading;
    $('search-input').placeholder = copy.searchPlaceholder;
    $('footer-privacy-note').textContent = copy.footerPrivacy;
    $('footer-shortcut-note').textContent = copy.footerShortcuts;
    $('backup-modal-title').textContent = copy.backupTitle;
    $('backup-modal-desc').textContent = copy.backupDesc;
    $('export-json-btn').textContent = copy.exportJson;
    $('export-md-btn').textContent = copy.exportMd;
    $('import-json-text').textContent = copy.importJson;
    $('clear-samples-btn').textContent = copy.clearSamples;
    $('reader-edit-btn').textContent = copy.edit;
    $('reader-delete-btn').textContent = copy.delete;

    if (state.editingId) {
      const target = state.entries.find((e) => e.id === state.editingId);
      if (target) {
        $('editing-banner-text').textContent = copy.editingBanner(target.date);
      }
    }

    renderGreeting();
    updateWordCount();
  }

  function renderVibePicker() {
    const container = $('vibe-picker');
    container.textContent = '';

    VIBES.forEach((vibe) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vibe-chip';
      btn.dataset.vibe = vibe.id;
      btn.setAttribute('aria-pressed', String(state.selectedVibe === vibe.id));
      btn.style.setProperty('--vibe-color', vibe.color);
      btn.style.setProperty('--chip-tint', vibe.tint);

      const dot = document.createElement('span');
      dot.className = 'vibe-dot';
      dot.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.textContent = vibeLabel(vibe.id);

      btn.append(dot, label);
      btn.addEventListener('click', () => {
        state.selectedVibe = vibe.id;
        renderVibePicker();
        applyActiveVibeAtmosphere();
        persistDraft();
      });

      container.append(btn);
    });
  }

  function renderVibeStrip() {
    const strip = $('vibe-strip');
    const meta = $('strip-meta');
    const copy = t();

    strip.textContent = '';
    const sorted = getSortedEntries();
    const recent = sorted.slice(0, 28).reverse();

    if (!recent.length) {
      const empty = document.createElement('span');
      empty.className = 'strip-empty';
      empty.textContent = copy.stripEmpty;
      strip.append(empty);
    } else {
      recent.forEach((entry) => {
        const vibe = VIBE_MAP[entry.vibe] || VIBES[0];
        const swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = 'strip-swatch';
        swatch.style.setProperty('--swatch-color', vibe.color);
        const label = `${entry.date} · ${vibeLabel(vibe.id)}${entry.title ? ` — ${entry.title}` : ''}`;
        swatch.title = label;
        swatch.setAttribute('aria-label', label);
        swatch.addEventListener('click', () => {
          jumpToEntry(entry.id);
        });
        strip.append(swatch);
      });
    }

    const countText = copy.entriesCount(sorted.length);
    const streak = calculateStreak(sorted);
    meta.textContent = streak > 0 ? `${countText} · ${copy.streakLabel(streak)}` : countText;
  }

  function renderFilterBar() {
    const bar = $('filter-bar');
    bar.textContent = '';

    const counts = {};
    state.entries.forEach((e) => {
      counts[e.vibe] = (counts[e.vibe] || 0) + 1;
    });

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'filter-chip';
    allBtn.setAttribute('aria-pressed', String(state.filterVibe === 'all'));
    allBtn.append(document.createTextNode(t().filterAll));

    const allCount = document.createElement('span');
    allCount.className = 'filter-count';
    allCount.textContent = String(state.entries.length);
    allBtn.append(allCount);

    allBtn.addEventListener('click', () => {
      state.filterVibe = 'all';
      renderFilterBar();
      renderTimeline();
    });
    bar.append(allBtn);

    VIBES.forEach((vibe) => {
      const count = counts[vibe.id] || 0;
      if (count === 0 && state.filterVibe !== vibe.id) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-chip';
      btn.setAttribute('aria-pressed', String(state.filterVibe === vibe.id));

      const dot = document.createElement('span');
      dot.className = 'vibe-dot';
      dot.style.setProperty('--vibe-color', vibe.color);
      dot.setAttribute('aria-hidden', 'true');

      const text = document.createElement('span');
      text.textContent = vibeLabel(vibe.id);

      const countSpan = document.createElement('span');
      countSpan.className = 'filter-count';
      countSpan.textContent = String(count);

      btn.append(dot, text, countSpan);
      btn.addEventListener('click', () => {
        state.filterVibe = state.filterVibe === vibe.id ? 'all' : vibe.id;
        renderFilterBar();
        renderTimeline();
      });

      bar.append(btn);
    });
  }

  function getSortedEntries() {
    return [...state.entries].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }

  function getFilteredEntries() {
    const q = state.searchQuery.trim().toLowerCase();
    return getSortedEntries().filter((entry) => {
      if (state.filterVibe !== 'all' && entry.vibe !== state.filterVibe) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        entry.title,
        entry.body,
        entry.music,
        entry.place,
        entry.date,
        vibeLabel(entry.vibe),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function createSvgIcon(pathMarkup) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = pathMarkup;
    return svg;
  }

  function renderTimeline() {
    const container = $('timeline');
    container.textContent = '';

    const entries = getFilteredEntries();
    const copy = t();

    if (!entries.length) {
      const box = document.createElement('div');
      box.className = 'empty-state';

      const title = document.createElement('p');
      title.className = 'empty-state-title';
      title.textContent =
        state.entries.length === 0 ? copy.emptyNoEntriesTitle : copy.emptyFilteredTitle;

      const desc = document.createElement('p');
      desc.className = 'empty-state-desc';
      desc.textContent =
        state.entries.length === 0 ? copy.emptyNoEntriesDesc : copy.emptyFilteredDesc;

      box.append(title, desc);
      container.append(box);
      return;
    }

    // Group by YYYY-MM
    const groups = new Map();
    entries.forEach((entry) => {
      const key = entry.date.slice(0, 7);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });

    groups.forEach((monthEntries, monthKey) => {
      const section = document.createElement('section');
      section.className = 'month-group';

      const heading = document.createElement('h3');
      heading.className = 'month-label';
      heading.textContent = formatMonthHeading(monthKey, state.prefs.lang);
      section.append(heading);

      monthEntries.forEach((entry) => {
        section.append(buildEntryCard(entry));
      });

      container.append(section);
    });
  }

  function buildEntryCard(entry) {
    const vibe = VIBE_MAP[entry.vibe] || VIBES[0];
    const copy = t();

    const card = document.createElement('article');
    card.className = 'entry-card';
    card.id = `entry-${entry.id}`;
    card.tabIndex = 0;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.entry-actions')) return;
      openReaderModal(entry.id);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target === card) {
          e.preventDefault();
          openReaderModal(entry.id);
        }
      }
    });

    // Top Meta Row
    const top = document.createElement('div');
    top.className = 'entry-top';

    const metaLeft = document.createElement('div');
    metaLeft.className = 'entry-meta-left';

    const dateEl = document.createElement('time');
    dateEl.className = 'entry-date';
    dateEl.dateTime = entry.date;
    dateEl.textContent = formatEntryDate(entry.date, entry.createdAt, state.prefs.lang);

    const vibeTag = document.createElement('span');
    vibeTag.className = 'entry-vibe-tag';
    vibeTag.style.setProperty('--tag-tint', vibe.tint);

    const dot = document.createElement('span');
    dot.className = 'vibe-dot';
    dot.style.setProperty('--vibe-color', vibe.color);
    dot.setAttribute('aria-hidden', 'true');

    vibeTag.append(dot, document.createTextNode(vibeLabel(vibe.id)));
    metaLeft.append(dateEl, vibeTag);

    if (entry.isSample) {
      const sampleBadge = document.createElement('span');
      sampleBadge.className = 'entry-sample-badge';
      sampleBadge.textContent = copy.sampleBadge;
      metaLeft.append(sampleBadge);
    }

    // Hover Quick Actions
    const actions = document.createElement('div');
    actions.className = 'entry-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'entry-action-btn';
    editBtn.title = copy.edit;
    editBtn.setAttribute('aria-label', copy.edit);
    editBtn.append(
      createSvgIcon(
        '<path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />'
      )
    );
    editBtn.addEventListener('click', () => startEditing(entry.id));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'entry-action-btn delete';
    delBtn.title = copy.delete;
    delBtn.setAttribute('aria-label', copy.delete);
    delBtn.append(
      createSvgIcon(
        '<polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" />'
      )
    );
    delBtn.addEventListener('click', () => deleteEntry(entry.id));

    actions.append(editBtn, delBtn);
    top.append(metaLeft, actions);
    card.append(top);

    if (entry.title) {
      const titleEl = document.createElement('h4');
      titleEl.className = 'entry-title';
      titleEl.textContent = entry.title;
      card.append(titleEl);
    }

    if (entry.body) {
      const excerpt = document.createElement('p');
      excerpt.className = 'entry-excerpt';
      excerpt.textContent = entry.body;
      card.append(excerpt);
    }

    if (entry.photo) {
      const img = document.createElement('img');
      img.className = 'entry-photo';
      img.src = entry.photo;
      img.alt = entry.title || copy.untitled;
      img.loading = 'lazy';
      card.append(img);
    }

    if (entry.music || entry.place) {
      const anchors = document.createElement('div');
      anchors.className = 'entry-anchors';

      if (entry.music) {
        const musicItem = document.createElement('span');
        musicItem.className = 'anchor-item';
        musicItem.append(
          createSvgIcon(
            '<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />'
          ),
          document.createTextNode(entry.music)
        );
        anchors.append(musicItem);
      }

      if (entry.place) {
        const placeItem = document.createElement('span');
        placeItem.className = 'anchor-item';
        placeItem.append(
          createSvgIcon(
            '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />'
          ),
          document.createTextNode(entry.place)
        );
        anchors.append(placeItem);
      }

      card.append(anchors);
    }

    return card;
  }

  function renderAll() {
    renderStaticCopy();
    renderVibePicker();
    renderVibeStrip();
    renderFilterBar();
    renderTimeline();
    updateSamplesButtonVisibility();
    updateSaveButtonState();
  }

  /* ------------------------------------------------------------------------
     Composer Actions
     ------------------------------------------------------------------------ */

  function autoResizeTextarea() {
    const el = $('entry-body-input');
    el.style.height = 'auto';
    el.style.height = `${Math.max(132, el.scrollHeight)}px`;
  }

  function updateWordCount() {
    const body = $('entry-body-input').value;
    const count = countWordsAndChars(body, state.prefs.lang);
    $('word-count').textContent = t().wordCount(count);
  }

  function updateSaveButtonState() {
    const hasTitle = $('entry-title-input').value.trim().length > 0;
    const hasBody = $('entry-body-input').value.trim().length > 0;
    const hasPhoto = Boolean(state.pendingPhoto);
    $('save-entry-btn').disabled = !(hasTitle || hasBody || hasPhoto);
  }

  function setPendingPhoto(dataUrl) {
    state.pendingPhoto = dataUrl;
    const wrap = $('photo-preview-wrap');
    const img = $('photo-preview-img');
    if (dataUrl) {
      img.src = dataUrl;
      wrap.hidden = false;
      $('photo-attach-text').textContent = t().photoAdded;
    } else {
      img.removeAttribute('src');
      wrap.hidden = true;
      $('entry-photo-input').value = '';
      $('photo-attach-text').textContent = t().photoBtn;
    }
    updateSaveButtonState();
  }

  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File read error'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Image decode error'));
        img.onload = () => {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width >= height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function resetComposer() {
    state.editingId = null;
    clearTimeout(state.draftTimer);
    $('draft-status').classList.remove('visible');
    $('editing-banner').hidden = true;
    $('entry-title-input').value = '';
    $('entry-body-input').value = '';
    $('entry-music-input').value = '';
    $('entry-place-input').value = '';
    $('entry-date-input').value = toLocalDateStr(new Date());
    setPendingPhoto(null);
    autoResizeTextarea();
    updateWordCount();
    updateSaveButtonState();
    $('save-btn-label').textContent = t().saveEntry;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const title = $('entry-title-input').value.trim();
    const body = $('entry-body-input').value.trim();
    const music = $('entry-music-input').value.trim();
    const place = $('entry-place-input').value.trim();
    const date = $('entry-date-input').value || toLocalDateStr(new Date());

    if (!title && !body && !state.pendingPhoto) return;

    if (state.editingId) {
      const idx = state.entries.findIndex((item) => item.id === state.editingId);
      if (idx !== -1) {
        const prev = state.entries[idx];
        state.entries[idx] = {
          ...prev,
          date,
          vibe: state.selectedVibe,
          title,
          body,
          music,
          place,
          photo: state.pendingPhoto,
          isSample: false,
          updatedAt: Date.now(),
        };
        if (saveEntries()) {
          resetComposer();
          renderVibeStrip();
          renderFilterBar();
          renderTimeline();
          updateSamplesButtonVisibility();
          showToast(t().toastUpdated);
        }
      }
      return;
    }

    const newEntry = {
      id: generateId(),
      date,
      createdAt: Date.now(),
      vibe: state.selectedVibe,
      title,
      body,
      music,
      place,
      photo: state.pendingPhoto,
      isSample: false,
    };

    state.entries.unshift(newEntry);
    if (!saveEntries()) {
      state.entries.shift();
      return;
    }

    clearDraft();
    resetComposer();
    renderVibeStrip();
    renderFilterBar();
    renderTimeline();
    updateSamplesButtonVisibility();
    showToast(t().toastSaved);
  }

  function startEditing(entryId) {
    const entry = state.entries.find((e) => e.id === entryId);
    if (!entry) return;

    closeReaderModal();
    state.editingId = entry.id;
    state.selectedVibe = VIBE_MAP[entry.vibe] ? entry.vibe : 'golden';

    $('entry-date-input').value = entry.date;
    $('entry-title-input').value = entry.title || '';
    $('entry-body-input').value = entry.body || '';
    $('entry-music-input').value = entry.music || '';
    $('entry-place-input').value = entry.place || '';
    setPendingPhoto(entry.photo || null);

    $('editing-banner-text').textContent = t().editingBanner(entry.date);
    $('editing-banner').hidden = false;
    $('save-btn-label').textContent = t().updateEntry;

    renderVibePicker();
    applyActiveVibeAtmosphere();
    autoResizeTextarea();
    updateWordCount();
    updateSaveButtonState();

    $('composer-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => $('entry-body-input').focus(), 220);
  }

  function deleteEntry(entryId) {
    const idx = state.entries.findIndex((e) => e.id === entryId);
    if (idx === -1) return;

    const [removed] = state.entries.splice(idx, 1);
    state.lastDeleted = { entry: removed, index: idx };

    if (state.editingId === entryId) {
      resetComposer();
    }
    if (state.activeReaderId === entryId) {
      closeReaderModal();
    }

    saveEntries();
    renderVibeStrip();
    renderFilterBar();
    renderTimeline();
    updateSamplesButtonVisibility();

    showToast(t().toastDeleted, t().toastUndo, () => {
      if (!state.lastDeleted) return;
      const { entry, index } = state.lastDeleted;
      state.entries.splice(Math.min(index, state.entries.length), 0, entry);
      state.lastDeleted = null;
      saveEntries();
      renderVibeStrip();
      renderFilterBar();
      renderTimeline();
      updateSamplesButtonVisibility();
      showToast(t().toastRestored);
    });
  }

  function jumpToEntry(entryId) {
    state.filterVibe = 'all';
    state.searchQuery = '';
    $('search-input').value = '';
    $('search-clear-btn').hidden = true;
    renderFilterBar();
    renderTimeline();

    const card = $(`entry-${entryId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('highlight-pulse');
      setTimeout(() => card.classList.remove('highlight-pulse'), 1400);
    }
  }

  /* ------------------------------------------------------------------------
     Reader & Backup Modals
     ------------------------------------------------------------------------ */

  function openReaderModal(entryId) {
    const entry = state.entries.find((e) => e.id === entryId);
    if (!entry) return;

    state.activeReaderId = entryId;
    const vibe = VIBE_MAP[entry.vibe] || VIBES[0];

    const meta = $('reader-meta');
    meta.textContent = '';

    const dateEl = document.createElement('time');
    dateEl.className = 'entry-date';
    dateEl.textContent = formatEntryDate(entry.date, entry.createdAt, state.prefs.lang);

    const vibeTag = document.createElement('span');
    vibeTag.className = 'entry-vibe-tag';
    vibeTag.style.setProperty('--tag-tint', vibe.tint);

    const dot = document.createElement('span');
    dot.className = 'vibe-dot';
    dot.style.setProperty('--vibe-color', vibe.color);
    dot.setAttribute('aria-hidden', 'true');

    vibeTag.append(dot, document.createTextNode(vibeLabel(vibe.id)));
    meta.append(dateEl, vibeTag);

    const titleEl = $('reader-title');
    if (entry.title) {
      titleEl.textContent = entry.title;
      titleEl.hidden = false;
    } else {
      titleEl.textContent = '';
      titleEl.hidden = true;
    }

    const bodyEl = $('reader-body');
    bodyEl.textContent = entry.body || '';
    bodyEl.hidden = !entry.body;

    const photoEl = $('reader-photo');
    if (entry.photo) {
      photoEl.src = entry.photo;
      photoEl.alt = entry.title || t().untitled;
      photoEl.hidden = false;
    } else {
      photoEl.removeAttribute('src');
      photoEl.hidden = true;
    }

    const anchorsEl = $('reader-anchors');
    anchorsEl.textContent = '';
    if (entry.music || entry.place) {
      if (entry.music) {
        const musicItem = document.createElement('span');
        musicItem.className = 'anchor-item';
        musicItem.append(
          createSvgIcon(
            '<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />'
          ),
          document.createTextNode(entry.music)
        );
        anchorsEl.append(musicItem);
      }
      if (entry.place) {
        const placeItem = document.createElement('span');
        placeItem.className = 'anchor-item';
        placeItem.append(
          createSvgIcon(
            '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />'
          ),
          document.createTextNode(entry.place)
        );
        anchorsEl.append(placeItem);
      }
      anchorsEl.hidden = false;
    } else {
      anchorsEl.hidden = true;
    }

    $('reader-modal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('reader-close-btn').focus();
  }

  function closeReaderModal() {
    state.activeReaderId = null;
    $('reader-modal').hidden = true;
    if ($('backup-modal').hidden) {
      document.body.style.overflow = '';
    }
  }

  function openBackupModal() {
    updateSamplesButtonVisibility();
    $('backup-modal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('backup-close-btn').focus();
  }

  function closeBackupModal() {
    $('backup-modal').hidden = true;
    if ($('reader-modal').hidden) {
      document.body.style.overflow = '';
    }
  }

  function updateSamplesButtonVisibility() {
    const hasSamples = state.entries.some((e) => e.isSample);
    $('clear-samples-btn').hidden = !hasSamples;
  }

  /* ------------------------------------------------------------------------
     Export / Import
     ------------------------------------------------------------------------ */

  function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const payload = {
      app: 'vibe-diary',
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: getSortedEntries(),
    };
    const stamp = toLocalDateStr(new Date());
    downloadBlob(JSON.stringify(payload, null, 2), `vibe-diary-${stamp}.json`, 'application/json');
    showToast(t().toastExportedJson);
  }

  function exportMarkdown() {
    const sorted = getSortedEntries();
    const lines = [`# ${t().brand}`, ''];

    sorted.forEach((entry) => {
      const heading = entry.title ? `${entry.date} — ${entry.title}` : entry.date;
      lines.push(`## ${heading}`);
      const metaParts = [`**Vibe:** ${vibeLabel(entry.vibe)}`];
      if (entry.music) metaParts.push(`**Soundtrack:** ${entry.music}`);
      if (entry.place) metaParts.push(`**Place:** ${entry.place}`);
      lines.push(metaParts.join(' · '));
      lines.push('');
      if (entry.body) {
        lines.push(entry.body);
        lines.push('');
      }
      lines.push('---', '');
    });

    const stamp = toLocalDateStr(new Date());
    downloadBlob(lines.join('\n'), `vibe-diary-${stamp}.md`, 'text/markdown;charset=utf-8');
    showToast(t().toastExportedMd);
  }

  function importJsonFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const incoming = Array.isArray(parsed) ? parsed : parsed?.entries;
        if (!Array.isArray(incoming)) throw new Error('Invalid format');

        const existingIds = new Set(state.entries.map((e) => e.id));
        let added = 0;

        incoming.forEach((item) => {
          if (!item || typeof item !== 'object') return;
          const date = typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
            ? item.date
            : toLocalDateStr(new Date());
          const id = typeof item.id === 'string' && item.id ? item.id : generateId();
          if (existingIds.has(id)) return;

          state.entries.push({
            id,
            date,
            createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
            vibe: VIBE_MAP[item.vibe] ? item.vibe : 'golden',
            title: typeof item.title === 'string' ? item.title : '',
            body: typeof item.body === 'string' ? item.body : '',
            music: typeof item.music === 'string' ? item.music : '',
            place: typeof item.place === 'string' ? item.place : '',
            photo: typeof item.photo === 'string' && item.photo.startsWith('data:image/')
              ? item.photo
              : null,
            isSample: Boolean(item.isSample),
          });
          existingIds.add(id);
          added += 1;
        });

        if (saveEntries()) {
          renderVibeStrip();
          renderFilterBar();
          renderTimeline();
          updateSamplesButtonVisibility();
          closeBackupModal();
          showToast(t().toastImported(added));
        }
      } catch {
        showToast(t().toastImportErr);
      }
    };
    reader.onerror = () => showToast(t().toastImportErr);
    reader.readAsText(file);
  }

  /* ------------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------------ */

  let activeToastCallback = null;

  function showToast(message, actionLabel = null, onAction = null) {
    const toast = $('toast');
    const msgEl = $('toast-message');
    const actionBtn = $('toast-action-btn');

    clearTimeout(state.toastTimer);
    msgEl.textContent = message;
    activeToastCallback = onAction;

    if (actionLabel && onAction) {
      actionBtn.textContent = actionLabel;
      actionBtn.hidden = false;
    } else {
      actionBtn.hidden = true;
    }

    toast.classList.add('visible');
    state.toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
      activeToastCallback = null;
    }, actionLabel ? 5500 : 2800);
  }

  /* ------------------------------------------------------------------------
     Event Wiring & Boot
     ------------------------------------------------------------------------ */

  function bindEvents() {
    $('lang-toggle-btn').addEventListener('click', () => {
      state.prefs.lang = state.prefs.lang === 'en' ? 'zh' : 'en';
      savePrefs();
      renderAll();
    });

    $('theme-toggle-btn').addEventListener('click', () => {
      state.prefs.theme = state.prefs.theme === 'day' ? 'evening' : 'day';
      savePrefs();
      applyTheme();
    });

    $('entry-form').addEventListener('submit', handleFormSubmit);

    $('editing-cancel-btn').addEventListener('click', () => {
      resetComposer();
      renderVibePicker();
      applyActiveVibeAtmosphere();
    });

    const onInputChange = () => {
      autoResizeTextarea();
      updateWordCount();
      updateSaveButtonState();
      persistDraft();
    };

    $('entry-title-input').addEventListener('input', onInputChange);
    $('entry-body-input').addEventListener('input', onInputChange);
    $('entry-music-input').addEventListener('input', persistDraft);
    $('entry-place-input').addEventListener('input', persistDraft);
    $('entry-date-input').addEventListener('change', persistDraft);

    $('entry-photo-input').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const compressed = await compressImageFile(file);
        setPendingPhoto(compressed);
      } catch {
        showToast(t().toastPhotoErr);
      }
    });

    $('photo-remove-btn').addEventListener('click', () => setPendingPhoto(null));

    $('search-input').addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      $('search-clear-btn').hidden = !state.searchQuery;
      renderTimeline();
    });

    $('search-clear-btn').addEventListener('click', () => {
      state.searchQuery = '';
      $('search-input').value = '';
      $('search-clear-btn').hidden = true;
      renderTimeline();
      $('search-input').focus();
    });

    // Reader modal controls
    $('reader-close-btn').addEventListener('click', closeReaderModal);
    $('reader-modal').addEventListener('click', (e) => {
      if (e.target === $('reader-modal')) closeReaderModal();
    });
    $('reader-edit-btn').addEventListener('click', () => {
      if (state.activeReaderId) startEditing(state.activeReaderId);
    });
    $('reader-delete-btn').addEventListener('click', () => {
      if (state.activeReaderId) deleteEntry(state.activeReaderId);
    });

    // Backup modal controls
    $('backup-open-btn').addEventListener('click', openBackupModal);
    $('backup-close-btn').addEventListener('click', closeBackupModal);
    $('backup-modal').addEventListener('click', (e) => {
      if (e.target === $('backup-modal')) closeBackupModal();
    });
    $('export-json-btn').addEventListener('click', exportJson);
    $('export-md-btn').addEventListener('click', exportMarkdown);
    $('import-json-input').addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        importJsonFile(file);
        e.target.value = '';
      }
    });
    $('clear-samples-btn').addEventListener('click', () => {
      state.entries = state.entries.filter((e) => !e.isSample);
      saveEntries();
      renderVibeStrip();
      renderFilterBar();
      renderTimeline();
      updateSamplesButtonVisibility();
      closeBackupModal();
      showToast(t().toastSamplesCleared);
    });

    // Toast action button
    $('toast-action-btn').addEventListener('click', () => {
      if (activeToastCallback) {
        const cb = activeToastCallback;
        activeToastCallback = null;
        cb();
      }
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!$('save-entry-btn').disabled && $('reader-modal').hidden && $('backup-modal').hidden) {
          e.preventDefault();
          $('entry-form').requestSubmit();
        }
        return;
      }

      if (e.key === 'Escape') {
        if (!$('reader-modal').hidden) closeReaderModal();
        else if (!$('backup-modal').hidden) closeBackupModal();
        return;
      }

      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '') &&
        $('reader-modal').hidden &&
        $('backup-modal').hidden
      ) {
        e.preventDefault();
        $('search-input').focus();
      }
    });
  }

  function init() {
    loadPrefs();
    loadEntries();
    $('entry-date-input').value = toLocalDateStr(new Date());
    loadDraft();
    applyTheme();
    renderAll();
    autoResizeTextarea();
    bindEvents();
  }

  init();
})();
