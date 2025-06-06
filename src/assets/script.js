document.addEventListener('DOMContentLoaded', loadQOLFunctions);

/**
 * Initializes and loads Quality of Life (QOL) functions for the application.
 * This function sets up the following functionalities:
 * - Menu navigation handling
 * - Scroll navigation handling
 * - Moving the active menu item to the left
 */
function loadQOLFunctions() {
  selectFirstSection();
  // redirectToSelectedItem();
  handleMenuNavigation();
  handleScrollNavigation();
}


/**
 * Selects the first menu item in the menu header and adds the 'active' class to it.
 */
function selectFirstSection() {
  const menuItems = document.querySelectorAll('.menu-header > ul > li');
  menuItems[0].classList.add('active');
}

function redirectToSelectedItem() {
  if (!location.hash) {
    const firstSection = document.querySelectorAll('main.menu-body > section')[0];
    location.hash = `#${firstSection.id}`;
  } else {
    moveActiveMenuItemLeft(document.querySelector(location.hash));
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
        moveActiveMenuItemLeft(item);
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
  const menuItems = document.querySelectorAll('.menu-header > ul > li');
  const sections = document.querySelectorAll('main.menu-body > section');
  window.addEventListener('scroll', () => {
    let currentSection = '';
    if (window.pageYOffset < 60) {
      currentSection = sections[0].getAttribute('id');
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 50) {
          currentSection = section.getAttribute('id');
        }
      });
    }
    menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.querySelector('a').getAttribute('href').includes(currentSection)) {
        item.classList.add('active');
        moveActiveMenuItemLeft(item);
        // location.hash = `#${currentSection}`;
      }
    });
  });
}

/**
 * Smoothly scrolls the specified menu item into view, aligning it to the start of the container.
 *
 * @param {HTMLElement} item - The menu item to scroll into view.
 */
function moveActiveMenuItemLeft(item) {
  item.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'start'
  });
}