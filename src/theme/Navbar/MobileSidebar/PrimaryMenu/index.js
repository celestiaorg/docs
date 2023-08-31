import React from 'react';
import {useLocation} from '@docusaurus/router';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import CustomVersionSelector from '@site/src/components/CustomVersionSelector';

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items;
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar();
  const location = useLocation();
  const items = useNavbarItems();

  // If pathname starts with '/api/', hide 'docsVersionDropdown'
  const filteredItems = location.pathname.startsWith('/api/') 
    ? items.filter(item => item.type !== 'docsVersionDropdown') 
    : items;

  const versions = ['v0.11.0-rc10', 'v0.11.0-rc8-arabica-improvements', 'v0.11.0-rc8', 'Next']; 

  return (
    <ul className="menu__list">
      {filteredItems.map((item, i) => (
        <NavbarItem
          mobile
          {...item}
          onClick={() => mobileSidebar.toggle()}
          key={i}
        />
      ))}
      {location.pathname.startsWith('/api/') && <CustomVersionSelector className="custom-version-selector-menu" versions={versions} />}
    </ul>
  );
}