document.addEventListener('DOMContentLoaded', loadQOLFunctions);

/**
 * Initializes and loads Quality of Life (QOL) functions for the application.
 * This function sets up the following functionalities:
 * - Menu navigation handling
 * - Scroll navigation handling
 * - Moving the active menu item to the left
 */
function loadQOLFunctions() {
  removeSelectedSection();
  // redirectToSelectedItem();
  selectFirstSection();
  handleMenuNavigation();
  handleScrollNavigation();
  loadProductLanguageSelectors();
}

function detectUserLanguage() {
  const supported = ['ro', 'en', 'bg', 'tr'];
  const lang = (navigator.language || 'en').toLowerCase().split('-')[0];
  return supported.includes(lang) ? lang : 'en';
}

function loadProductLanguageSelectors() {
  const menuItems = document.querySelectorAll('.menu-item');
  if (!menuItems.length) {
    return;
  }

  const defaultLang = detectUserLanguage();

  menuItems.forEach(menuItem => {
    const buttons = menuItem.querySelectorAll('.js-lang-btn');
    if (!buttons.length) {
      return;
    }

    setActiveLangButton(buttons, defaultLang);
    applyProductLanguage(menuItem, defaultLang);

    buttons.forEach(btn => {
      ['click', 'mousedown', 'touchstart'].forEach(eventName => {
        btn.addEventListener(eventName, event => {
          event.stopPropagation();
        });
      });

      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        setActiveLangButton(buttons, lang);
        applyProductLanguage(menuItem, lang);
      });
    });
  });
}

function setActiveLangButton(buttons, lang) {
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function getLocalizedText(element, language) {
  if (!element) {
    return '';
  }
  return element.dataset[language] || element.dataset.en || element.dataset.ro || '';
}

function applyProductLanguage(menuItem, language) {
  const titleElement = menuItem.querySelector('.js-product-name');
  const descriptionElement = menuItem.querySelector('.js-product-description');
  const arrow = menuItem.querySelector('.arrow');

  if (titleElement) {
    titleElement.textContent = getLocalizedText(titleElement, language);
  }

  if (descriptionElement) {
    const description = getLocalizedText(descriptionElement, language);
    descriptionElement.textContent = description;
    descriptionElement.classList.toggle('d-none', !description);
    if (arrow) {
      arrow.style.display = description ? 'inline-block' : 'none';
    }
  }
}

function setNavbarVisibility(c) {
  const menuWrapper = document.querySelector('.menu-header');
  menuWrapper.classList.remove('scrolled-down', 'scrolled-up');
  menuWrapper.classList.add(c);
}

function removeSelectedSection() {
  console.log(location.hash);
  if (location.hash) {
    location.replace('');
  }
}

/**
 * Selects the first menu item in the menu header and adds the 'active' class to it.
 */
function selectFirstSection() {
  const menuItems = document.querySelectorAll('.menu-header > ul > li');
  menuItems[0].classList.add('active');
}

function redirectToSelectedItem() {
  const menu = document.querySelector('.menu-header > ul');
  if (!location.hash) {
    const firstSection = document.querySelectorAll('main.menu-body > section')[0];
    location.hash = `#${firstSection.id}`;
  } else {
    moveActiveMenuItemLeft(document.querySelector(location.hash, menu));
  }
}

/**
 * Handles the navigation of the menu by adding click event listeners to each menu item.
 * When a menu item is clicked, it removes the 'active' class from all menu items and adds it to the clicked item.
 * It also calls the `moveActiveMenuItemLeft` function to move the active menu item.
 */
function handleMenuNavigation() {
  const menuItems = document.querySelectorAll('.menu-header > ul > li');
  if (menuItems) {
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        menuItems.forEach(itm => {
          itm.classList.remove('active');
        })
        item.classList.add('active');
      })
    });
  }
}

/**
 * Handles the scroll navigation by adding an 'active' class to the menu item
 * corresponding to the section currently in view. It also moves the active
 * menu item to the left.
 *
 * This function selects all menu items and sections, and adds a scroll event
 * listener to the window. On scroll, it determines the current section in view
 * and updates the menu items accordingly.
 *
 * @function
 */
function handleScrollNavigation() {
  const menu = document.querySelector('.menu-header > ul');
  const menuItems = document.querySelectorAll('.menu-header > ul > li');
  const sections = document.querySelectorAll('main.menu-body > section');
  let pos = 0;
  let lastY = window.pageYOffset;
  window.addEventListener('scroll', () => {
    if (lastY > window.pageYOffset) {
      setNavbarVisibility('scrolled-up');
    } else if (lastY < window.pageYOffset) {
      setNavbarVisibility('scrolled-down');
    }
    lastY = window.pageYOffset <= 0 ? 0 : window.pageYOffset;
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset < 100) {
        currentSection = sections[0].getAttribute('id');
      }
      if (window.pageYOffset >= sectionTop - 50) {
        currentSection = section.getAttribute('id');
      } 
    });
    menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.querySelector('a').getAttribute('href').includes(currentSection)) {
        item.classList.add('active');
        if (pos !== item.offsetLeft) {
          pos = item.offsetLeft;
          moveActiveMenuItemLeft(item, menu);
        }
      }
    });
  });
}

/**
 * Smoothly scrolls the specified menu item into view, aligning it to the start of the container.
 *
 * @param {HTMLElement} item - The menu item to scroll into view.
 */
function moveActiveMenuItemLeft(item, menu) {
  menu.scrollTo({
    left: item.offsetLeft - 100,
    behavior: 'smooth'
  });
}
