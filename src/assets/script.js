document.addEventListener('DOMContentLoaded', loadQOLFunctions);

function loadQOLFunctions() {
  handleMenuNavigation();
  handleScrollNavigation();
  moveActiveMenuItemLeft();
}

function handleMenuNavigation() {
  const menuItems = document.querySelectorAll('.menu-header > ul > li');
  if (menuItems) {
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        menuItems.forEach(itm => {
          itm.classList.remove('active');
        })
        item.classList.add('active');
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        });
      })
    });
  }
}

function handleScrollNavigation() {
  const menuItems = document.querySelectorAll('.menu-header > ul > li');
  const sections = document.querySelectorAll('main.menu-body > section');
  window.addEventListener('scroll', () => {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 50) {
        currentSection = section.getAttribute('id');
      }
    });
    menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.querySelector('a').getAttribute('href').includes(currentSection)) {
        item.classList.add('active');
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        });
      }
    });
  });
}

function moveActiveMenuItemLeft() {

}