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

  const versions = ['v0.11.0-rc13', 'v0.11.0-rc12', 'v0.11.0-rc11', 'v0.11.0-rc8-arabica-improvements', 'v0.11.0-rc8']; 

  return (
    <ul className="menu__list">
      {items.map((item, i) => (
        <NavbarItem
          mobile
          {...item}
          onClick={() => mobileSidebar.toggle()}
          key={i}
        />
      ))}
      {location.pathname.includes('/api/') && <CustomVersionSelector className="custom-version-selector-menu" versions={versions} />}
    </ul>
  );
}