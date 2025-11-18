const STORAGE_KEY = 'hpWellnessEntries';
const SEED_ENTRIES = [
  {
    petName: 'Luna',
    observationType: 'Dry paws',
    severity: 'Moderate',
    notes: 'Cracks between pads, recommended balm + booties',
    visitDate: '2025-11-05'
  },
  {
    petName: 'Max',
    observationType: 'Coat matting',
    severity: 'Severe',
    notes: 'Hips matted, advised slicker comb homework',
    visitDate: '2025-10-28'
  },
  {
    petName: 'Luna',
    observationType: 'Dry paws',
    severity: 'Mild',
    notes: 'Improving but still dry after forest walks',
    visitDate: '2025-10-14'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#wellnessForm');
  const entriesBody = document.querySelector('#wellnessEntries');
  const emptyState = document.querySelector('#wellnessEmpty');
  const trendList = document.querySelector('#trendList');

  if (!form || !entriesBody || !trendList) {
    return;
  }

  let entries = loadEntries();
  render(entries);

  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const entry = {
      petName: formData.get('petName')?.trim() || 'Unnamed friend',
      observationType: formData.get('observationType'),
      severity: formData.get('severity'),
      notes: formData.get('notes')?.trim() || '—',
      visitDate: formData.get('visitDate')
    };

    entries = [entry, ...entries].slice(0, 12); // show most recent dozen
    saveEntries(entries);
    render(entries);
    form.reset();
  });

  function render(currentEntries) {
    if (!currentEntries.length) {
      emptyState.hidden = false;
      entriesBody.innerHTML = '';
    } else {
      emptyState.hidden = true;
      entriesBody.innerHTML = currentEntries
        .map(entry => {
          return `
            <tr>
              <td>${sanitize(entry.petName)}</td>
              <td>${sanitize(entry.observationType)}</td>
              <td>${sanitize(entry.severity)}</td>
              <td>${formatDate(entry.visitDate)}</td>
            </tr>
          `;
        })
        .join('');
    }
    renderTrends(currentEntries);
  }

  function renderTrends(currentEntries) {
    if (!currentEntries.length) {
      trendList.innerHTML = `<div class="insight-empty">Log a few sessions to see pattern prompts.</div>`;
      return;
    }

    const summary = currentEntries.reduce((acc, entry) => {
      const key = entry.observationType;
      if (!acc[key]) {
        acc[key] = { count: 0, lastSeverity: entry.severity, sample: entry.petName };
      }
      acc[key].count += 1;
      acc[key].lastSeverity = entry.severity;
      acc[key].sample = entry.petName;
      return acc;
    }, {});

    const ranked = Object.entries(summary)
      .filter(([, data]) => data.count >= 2)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4);

    if (!ranked.length) {
      trendList.innerHTML = `<div class="trend-pill positive">All clear — no repeated concerns logged.</div>`;
      return;
    }

    trendList.innerHTML = ranked
      .map(([issue, data]) => {
        const tone = data.count >= 3 ? 'alert' : '';
        const suggestion = buildSuggestion(issue, data.count, data.lastSeverity);
        return `
          <div class="trend-pill ${tone}">
            <span>${issue} ×${data.count}</span>
            <span>${suggestion}</span>
          </div>
        `;
      })
      .join('');
  }
});

function loadEntries() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTRIES));
    return [...SEED_ENTRIES];
  } catch {
    return [...SEED_ENTRIES];
  }
}

function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore persistence errors
  }
}

function buildSuggestion(issue, count, severity) {
  const baseCopy = {
    'Dry paws': 'Suggest balm add-on + home hydration plan.',
    'Coat matting': 'Offer maintenance trim or comb coaching.',
    'Skin redness': 'Flag for vet follow-up if irritation continues.',
    'Shedding spike': 'Promote de-shedding package and omega boosters.',
    'Ear irritation': 'Recommend gentle ear cleanse & watch for infection.'
  };

  if (count >= 3 || severity === 'Severe') {
    return baseCopy[issue] || 'Highlight for owner conversation.';
  }
  return 'Monitor next visit to confirm improvement.';
}

function sanitize(value) {
  return value?.replace(/[&<>"']/g, char => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return entities[char] || char;
  });
}

function formatDate(value) {
  if (!value) return '—';
  try {
    const formatter = new Intl.DateTimeFormat('en-IE', { month: 'short', day: '2-digit' });
    return formatter.format(new Date(value));
  } catch {
    return value;
  }
}
