// ==========================================================================
// LABUBU x Gen Z Taiwan - Interactive Application Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. PAGE LOADER & TRANSITION
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Simulate loading for better visual entry
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.visibility = 'hidden';
      }, 500);
    }, 1000);
  }

  // 2. SIDEBAR & MOBILE NAVIGATION
  const navItems = document.querySelectorAll('.nav-item');
  const panes = document.querySelectorAll('.pane');
  const paneTitle = document.getElementById('current-pane-title');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  // Trigger sidebar/mobile pane switching
  function switchPane(targetId) {
    // Hide all panes
    panes.forEach(pane => pane.classList.remove('active'));
    
    // Show target pane
    const targetPane = document.getElementById(targetId);
    if (targetPane) {
      targetPane.classList.add('active');
      
      // Scroll to top of panes container
      const container = document.querySelector('.panes-container');
      if (container) container.scrollTop = 0;
    }

    // Update active nav button
    navItems.forEach(item => {
      if (item.getAttribute('data-target') === targetId) {
        item.classList.add('active');
        // Update top bar text
        paneTitle.textContent = item.querySelector('.nav-label').textContent;
      } else {
        item.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (navMenu) navMenu.classList.remove('show');
  }

  // Bind nav click events
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      switchPane(target);
    });
  });

  // Bind inline CTA button clicks that link to other slides
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      switchPane('pane-persona');
    });
  }

  // Bind target triggers
  document.querySelectorAll('.nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-target');
      switchPane(target);
    });
  });

  // Mobile menu hamburger toggle
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('show');
    });
    
    // Close nav menu when clicking outside
    document.addEventListener('click', () => {
      navMenu.classList.remove('show');
    });
    
    navMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // 3. THEME TOGGLE (CANDY POP VS NEON DARK)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeBtnText = themeToggleBtn ? themeToggleBtn.querySelector('.theme-btn-text') : null;
  const themeBtnIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-btn-icon i') : null;

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('labubu-theme') || 'candy-pop';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('candy-pop-theme');
    if (themeBtnText) themeBtnText.textContent = '暗黑 Neon';
    if (themeBtnIcon) {
      themeBtnIcon.className = 'fa-solid fa-moon';
      themeBtnIcon.style.color = '#00f5d4';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('candy-pop-theme', !isDark);
      
      if (isDark) {
        localStorage.setItem('labubu-theme', 'dark');
        if (themeBtnText) themeBtnText.textContent = '暗黑 Neon';
        if (themeBtnIcon) {
          themeBtnIcon.className = 'fa-solid fa-moon';
          themeBtnIcon.style.color = '#00f5d4';
        }
      } else {
        localStorage.setItem('labubu-theme', 'candy-pop');
        if (themeBtnText) themeBtnText.textContent = '糖果 Pop';
        if (themeBtnIcon) {
          themeBtnIcon.className = 'fa-solid fa-droplet';
          themeBtnIcon.style.color = '#111';
        }
      }
      
      // Update charts for theme contrast changes
      updateChartsTheme(isDark);
    });
  }

  // 4. CHARM ACCORDION INTERACTION
  const accItems = document.querySelectorAll('.charm-accordion-item');
  const charmImg = document.getElementById('charm-dynamic-img');
  
  // Set images for each accordion item index
  const charmImages = [
    'assets/display.png', // Item 0
    'assets/keychain.png', // Item 1 (representing Lisa style)
    'assets/display.png'  // Item 2 (representing Box strategy)
  ];

  accItems.forEach(item => {
    const header = item.querySelector('.charm-acc-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      accItems.forEach(el => el.classList.remove('active'));
      
      // If was not active, open it
      if (!isActive) {
        item.classList.add('active');
        // Update photo inside Polaroid based on index
        const idx = parseInt(item.getAttribute('data-index'), 10);
        if (charmImg && charmImages[idx]) {
          charmImg.src = charmImages[idx];
        }
      }
    });
  });

  // 5. VIDEO CAMPAIGNS PLAYLIST
  const playlistItems = document.querySelectorAll('.playlist-item');
  const mainVideo = document.getElementById('main-video-element');
  const activeVideoTitle = document.getElementById('active-video-title');

  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      // Set active class in playlist
      playlistItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      
      // Change video source
      const videoSrc = item.getAttribute('data-src');
      const videoTitle = item.getAttribute('data-title');
      
      if (mainVideo && videoSrc) {
        mainVideo.src = videoSrc;
        mainVideo.load();
        mainVideo.play().catch(err => console.log("Video auto-play blocked: ", err));
      }
      
      if (activeVideoTitle && videoTitle) {
        activeVideoTitle.textContent = `正在播放：${videoTitle}`;
      }
    });
  });

  // 6. INTERACTIVE WORKSHOP STICKY NOTES
  const noteForm = document.getElementById('note-form');
  const authorInput = document.getElementById('author-name');
  const tagSelect = document.getElementById('note-tag');
  const contentInput = document.getElementById('note-content');
  const boardCanvas = document.getElementById('board-canvas');

  // Sticky notes model
  let stickyNotes = JSON.parse(localStorage.getItem('labubu-notes')) || [
    { id: 1, author: '曉婷', tag: 'marketing', content: '可以跟台大的社團合作改娃走秀，超狂！' },
    { id: 2, author: '阿豪', tag: 'product', content: '出一款社畜專屬的「擺爛加班」LABUBU公仔！' },
    { id: 3, author: '莉莉', tag: 'risk', content: '黃牛溢價太高會讓真心收藏的學生反感，抽選一定要嚴格。' }
  ];

  // Save notes to LocalStorage
  function saveNotes() {
    localStorage.setItem('labubu-notes', JSON.stringify(stickyNotes));
  }

  // Render notes
  function renderNotes() {
    if (!boardCanvas) return;
    boardCanvas.innerHTML = '';
    
    stickyNotes.forEach(note => {
      const noteEl = document.createElement('div');
      noteEl.className = `note-sticky cat-${note.tag}`;
      
      // Random rotation between -4deg and 4deg for natural neo-brutalism board feel
      const rot = (Math.random() * 8 - 4).toFixed(1);
      noteEl.style.setProperty('--rotate', `${rot}deg`);
      
      noteEl.innerHTML = `
        <button class="note-delete-btn" data-id="${note.id}"><i class="fa-solid fa-xmark"></i></button>
        <div class="note-sticky-text">${escapeHTML(note.content)}</div>
        <div class="note-sticky-footer">
          <span class="note-sticky-author">✍️ ${escapeHTML(note.author)}</span>
          <span class="note-sticky-category">${getCategoryLabel(note.tag)}</span>
        </div>
      `;
      
      boardCanvas.appendChild(noteEl);
    });

    // Bind delete events
    document.querySelectorAll('.note-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        deleteNote(id);
      });
    });
  }

  // Get localized label for sticky tags
  function getCategoryLabel(tag) {
    switch(tag) {
      case 'marketing': return '行銷';
      case 'product': return '產品';
      case 'risk': return '風險';
      default: return '點子';
    }
  }

  // Add note
  if (noteForm) {
    noteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newNote = {
        id: Date.now(),
        author: authorInput.value.trim(),
        tag: tagSelect.value,
        content: contentInput.value.trim()
      };

      stickyNotes.unshift(newNote);
      saveNotes();
      renderNotes();

      // Clear input fields
      contentInput.value = '';
      authorInput.value = '';
    });
  }

  // Delete note
  function deleteNote(id) {
    stickyNotes = stickyNotes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
  }

  // Helper function to escape HTML
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // 7. INTERACTIVE VOTING SYSTEM WITH CHART.JS
  const voteBtns = document.querySelectorAll('.vote-option-btn');
  const clearBtn = document.getElementById('clear-data-btn');

  // Voting model
  let votes = JSON.parse(localStorage.getItem('labubu-votes')) || [18, 12, 5];
  let userVotedOption = localStorage.getItem('labubu-user-vote'); // tracks which index user voted for

  // Update vote buttons visual states
  function updateVoteButtons() {
    voteBtns.forEach((btn, index) => {
      const countEl = btn.querySelector('.opt-count');
      if (countEl) countEl.textContent = `${votes[index]} 票`;

      if (userVotedOption !== null && parseInt(userVotedOption, 10) === index) {
        btn.classList.add('voted');
      } else {
        btn.classList.remove('voted');
      }
    });
  }

  // Handle vote button clicks
  voteBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // If user already voted for this same item, retract vote
      if (userVotedOption !== null && parseInt(userVotedOption, 10) === index) {
        votes[index] = Math.max(0, votes[index] - 1);
        userVotedOption = null;
        localStorage.removeItem('labubu-user-vote');
      } else {
        // If user voted for something else, subtract from old first
        if (userVotedOption !== null) {
          const oldIndex = parseInt(userVotedOption, 10);
          votes[oldIndex] = Math.max(0, votes[oldIndex] - 1);
        }
        // Add to new
        votes[index]++;
        userVotedOption = index;
        localStorage.setItem('labubu-user-vote', index);
      }

      localStorage.setItem('labubu-votes', JSON.stringify(votes));
      updateVoteButtons();
      updateVotingChart();
    });
  });

  // Reset workshop data
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('確定要清空所有便利貼與重設投票數據嗎？')) {
        // Reset notes
        stickyNotes = [
          { id: 1, author: '曉婷', tag: 'marketing', content: '可以跟台大的社團合作改娃走秀，超狂！' },
          { id: 2, author: '阿豪', tag: 'product', content: '出一款社畜專屬的「擺爛加班」LABUBU公仔！' },
          { id: 3, author: '莉莉', tag: 'risk', content: '黃牛溢價太高會讓真心收藏的學生反感，抽選一定要嚴格。' }
        ];
        saveNotes();
        renderNotes();

        // Reset votes
        votes = [18, 12, 5];
        userVotedOption = null;
        localStorage.removeItem('labubu-user-vote');
        localStorage.setItem('labubu-votes', JSON.stringify(votes));
        updateVoteButtons();
        updateVotingChart();
      }
    });
  }

  // 8. CHART.JS INITIALIZATIONS (SATURATED COLOR SCHEMES)
  let motivationChart, trendChart, channelsChart, votingChart;

  const fontOptions = {
    family: "'Plus Jakarta Sans', 'Fredoka', 'Noto Sans TC', sans-serif",
    weight: 'bold'
  };

  // Helper to check current theme colors
  function getThemeColors() {
    const isDark = document.body.classList.contains('dark-mode');
    return {
      text: isDark ? '#ffffff' : '#111111',
      grid: isDark ? 'rgba(0, 245, 212, 0.15)' : 'rgba(17, 17, 17, 0.08)',
      surface: isDark ? '#1f1237' : '#ffffff'
    };
  }

  function renderAllCharts() {
    const colors = getThemeColors();

    // Motivation Pie Chart
    const ctxMot = document.getElementById('chart-motivation');
    if (ctxMot) {
      motivationChart = new Chart(ctxMot, {
        type: 'doughnut',
        data: {
          labels: ['🌈 情緒陪伴/治癒', '⚡️ 社交社交貨幣', '🎨 改娃/手工創作', '🛠️ 擺設實用功能'],
          datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: ['#ff477e', '#7b2cbf', '#00f5d4', '#ffea00'],
            borderColor: '#111111',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: colors.text,
                font: fontOptions
              }
            }
          }
        }
      });
    }

    // Social Trend Line Chart
    const ctxTrend = document.getElementById('chart-trend');
    if (ctxTrend) {
      trendChart = new Chart(ctxTrend, {
        type: 'line',
        data: {
          labels: ['2024.Q1', '2024.Q2', '2024.Q3', '2024.Q4', '2025.Q1', '2025.Q2'],
          datasets: [
            {
              label: 'Threads 聲量',
              data: [5, 12, 45, 120, 380, 720],
              borderColor: '#ff477e',
              backgroundColor: 'rgba(255, 71, 126, 0.15)',
              borderWidth: 4,
              fill: true,
              tension: 0.3
            },
            {
              label: 'Instagram 貼文',
              data: [80, 110, 180, 290, 420, 510],
              borderColor: '#7b2cbf',
              backgroundColor: 'rgba(123, 44, 191, 0.15)',
              borderWidth: 4,
              fill: true,
              tension: 0.3
            },
            {
              label: 'Dcard 盲盒板',
              data: [30, 40, 75, 110, 190, 240],
              borderColor: '#00f5d4',
              backgroundColor: 'rgba(0, 245, 212, 0.15)',
              borderWidth: 4,
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: colors.text, font: fontOptions }
            }
          },
          scales: {
            x: {
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: fontOptions }
            },
            y: {
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: fontOptions }
            }
          }
        }
      });
    }

    // Channels Bar Chart
    const ctxChan = document.getElementById('chart-channels');
    if (ctxChan) {
      channelsChart = new Chart(ctxChan, {
        type: 'bar',
        data: {
          labels: ['短影音 Reels', 'Threads 貼文', 'Dcard 評測', '蝦皮二手價', '門市代排'],
          datasets: [{
            label: '影響決策因子權重 (%)',
            data: [42, 35, 12, 8, 3],
            backgroundColor: ['#ff477e', '#7b2cbf', '#00f5d4', '#ffea00', '#ffccd5'],
            borderColor: '#111111',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: fontOptions }
            },
            y: {
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: fontOptions }
            }
          }
        }
      });
    }

    // Live Voting Chart (Horizontal Bar)
    const ctxVote = document.getElementById('live-voting-chart');
    if (ctxVote) {
      votingChart = new Chart(ctxVote, {
        type: 'bar',
        data: {
          labels: ['毛絨吊飾', '經典盲盒', 'MEGA潮玩'],
          datasets: [{
            data: votes,
            backgroundColor: ['#ff477e', '#ffea00', '#00f5d4'],
            borderColor: '#111111',
            borderWidth: 2
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: fontOptions, stepSize: 1 }
            },
            y: {
              grid: { color: 'transparent' },
              ticks: { color: colors.text, font: fontOptions }
            }
          }
        }
      });
    }
  }

  // Update charts options dynamically when theme is switched
  function updateChartsTheme(isDark) {
    const colors = getThemeColors();
    const allCharts = [motivationChart, trendChart, channelsChart, votingChart];
    
    allCharts.forEach(chart => {
      if (!chart) return;
      
      // Update legend colors
      if (chart.options.plugins && chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = colors.text;
      }
      
      // Update scales grid & ticks colors
      if (chart.options.scales) {
        if (chart.options.scales.x) {
          chart.options.scales.x.ticks.color = colors.text;
          if (chart.options.scales.x.grid && chart.options.scales.x.grid.color !== 'transparent') {
            chart.options.scales.x.grid.color = colors.grid;
          }
        }
        if (chart.options.scales.y) {
          chart.options.scales.y.ticks.color = colors.text;
          if (chart.options.scales.y.grid && chart.options.scales.y.grid.color !== 'transparent') {
            chart.options.scales.y.grid.color = colors.grid;
          }
        }
      }
      
      chart.update();
    });
  }

  // Live update voting chart on click
  function updateVotingChart() {
    if (votingChart) {
      votingChart.data.datasets[0].data = votes;
      votingChart.update();
    }
  }

  // 9. INITIAL LIFECYCLE EXECUTION
  renderNotes();
  updateVoteButtons();
  renderAllCharts();

});
