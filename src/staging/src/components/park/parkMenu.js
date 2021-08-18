import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  AppBar,
  CssBaseline,
  Divider,
  Box,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { Link } from "gatsby"

const drawerWidth = 280

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBarNone: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  appBarOffset: theme.mixins.toolbar,
  drawerDesktop: {
    marginTop: 288,
    marginLeft: 40,
    padding: 10,
    width: drawerWidth,
  },
  drawerMobile: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

export default function ParkMenu(props) {
  const { window } = props

  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const data = props.data
  const alertsCount = props.data.advisories.totalCount

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: "Park Overview", url: "#park-overview-container", visible: true },
    {
      text: `Alerts (${alertsCount})`,
      url: "#park-advisory-details-container",
      visible: true,
    },
    { text: "Camping", url: "#park-camping-details-container", visible: true },
    { text: "Facilities", url: "#park-facility-container", visible: true },
    { text: "Activities", url: "#park-activity-container", visible: true },
    { text: "Maps and Location", url: "#park-map-container", visible: true },
    {
      text: "Learn about this park",
      url: "#park-about-container",
      visible: true,
    },
  ]

  const hasCamping = data.parkAccessStatus.parkFacilities.some(facility =>
    facility.facilityName.toLowerCase().includes("camping")
  )
  if (!hasCamping) menuItems[2].visible = false
  if (data.parkAccessStatus.parkFacilities.length === 0)
    menuItems[3].visible = false
  if (data.parkAccessStatus.parkActivities.length === 0)
    menuItems[4].visible = false

  const campingFacilities = data.parkAccessStatus.parkFacilities.filter(
    facility => facility.facilityName.toLowerCase().includes("camping")
  )

  let campingSubMenuItems = []
  campingFacilities.forEach(c => {
    const subMenu = {
      text: c.facilityName,
      url: "#park-camping-list-container",
    }
    campingSubMenuItems.push(subMenu)
  })

  const drawerSubItems = (
    <div className="nested-list">
      <List>
        {campingSubMenuItems.map((subMenu, index) => (
          <ListItem button key={index}>
            <Link to={subMenu.url}>
              <ListItemText primary={subMenu.text} />
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  )

  const drawerItems = (
    <div>
      <List>
        {menuItems
          .filter(m => m.visible)
          .map((menu, index) => (
            <>
              <ListItem button key={index}>
                <Link to={menu.url}>
                  <ListItemText primary={menu.text} />
                </Link>
              </ListItem>
              {menu.text === "Camping" && <>{drawerSubItems}</>}
            </>
          ))}
      </List>
    </div>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <div id="park-menu-container">
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap></Typography>
          </Toolbar>
        </AppBar>

        <nav className={classes.drawer} aria-label="park info menu">
          {/* Mobile */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerMobile,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawerItems}
            </Drawer>
          </Hidden>
          {/* Desktop */}
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerDesktop,
              }}
              variant="permanent"
              open
            >
              <Box m={1}>
                <Link to="/parks">
                  <h3>Park Info</h3>
                </Link>
              </Box>
              <Divider />
              {drawerItems}
            </Drawer>
          </Hidden>
        </nav>
      </div>
    </div>
  )
}

ParkMenu.propTypes = {
  window: PropTypes.func,
}