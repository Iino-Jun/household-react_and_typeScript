import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChaletIcon from '@mui/icons-material/Chalet';
import SsidChartIcon from '@mui/icons-material/SsidChart';

import React, { CSSProperties } from 'react'
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  drawerWidth: number,
  mobileOpen: boolean,
  handleDrawerClose: () => void,
  handleDrawerTransitionEnd: () => void
}
interface MenuItem {
  text: string,
  path: string,
  icon: React.ComponentType
}
const SideBar = ({drawerWidth,mobileOpen,handleDrawerClose,handleDrawerTransitionEnd}:SidebarProps) => {

  const Menuitems:MenuItem[] = [
    {text: "Home", path:"/", icon: ChaletIcon},
    {text: "Report", path:"/report", icon: SsidChartIcon},
  ]

  const baseLinkStyle:CSSProperties ={
    textDecoration: "none",
    color: "inherit",
    display: "block",
  }
  const activeLinkStype:CSSProperties = {
    background: "rgba(0,0,0,.08)"
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {Menuitems.map((item, index) => (
          <NavLink to={item.path} key={index} style= {({isActive})=> {
            // console.log(`選択させたメニュは${item.text}---${isActive}`)
            return{
              ...baseLinkStyle,
              ...(isActive ? activeLinkStype: {})
            }
          }}>
            <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );

  
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* mobil layout */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {/* PC layout */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default SideBar