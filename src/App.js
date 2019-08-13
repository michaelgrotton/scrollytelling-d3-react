import React from 'react';
import injectSheet from "react-jss";
import { Waypoint } from "react-waypoint";
import nyc from "./nyc.js"
import sf from "./sf.js"
import am from "./am.js"
import BarChart from "./BarChart.js"

const styles = {
  graphic: {
    flexBasis:"60%",
    height:"300px",
    borderRadius:"5px",
    position: "sticky",
    top:"250px",
    fontSize:"40px"
  },
  description: {
    height:"600px",
    textAlign:"center",
    padding:"50px 50px",
    fontSize:"20px"
  },
  container: {
    display:"flex",
    justifyContent:"space-around",
    flexDirection:"column"
  },
  step:{
    height:"100px",
    width:"100%",
    backgroundColor:"whitesmoke",
    border:"2px solid grey",
    borderRadius:"5px",
    marginBottom:"500px",
    fontSize:"25px",
    textAlign:"center",
    lineHeight:"100px",
    zIndex:1,
    opacity:".8"
  },
  scroller: {
    flexBasis:"30%"
  },
  title: {
    margin:"20px 0",
    padding:"0",
    fontSize:"25px"
  },
  "@media (min-width: 768px)": {
    container: {
      flexDirection:"row"
    },
    step: {
      '&:last-child': {
        marginBottom: "200px",
      }
    },
    description: {
      padding:"100px 250px"
    },
    triggerTop: {
      borderTop:"1px dashed black",
      marginTop: "33vh",
      position:"fixed",
      width:"100%"
    }
  }
}

const cities = ["nyc", "sf", "am"]
const cityNames = {"nyc": "New York City", "sf": "San Francisco", "am": "Amsterdam", "": ""}

class App extends React.Component {
  state = {
    temps:{},
    city: "",
    screenWidth: 0,
    screenHeight: 0
  }

  componentDidMount() {
      sf.forEach(day => (day.date = new Date(day.date)));
      nyc.forEach(day => (day.date = new Date(day.date)));
      am.forEach(day => (day.date = new Date(day.date)));
      this.setState({ temps: { sf, nyc, am } });
      window.addEventListener('resize', this.onResize, false)
      this.onResize()
  }

  onResize = () => {
    let screenWidth = window.innerWidth
    let screenHeight = window.innerHeight

    if( screenWidth > 768 ) {
      screenWidth = screenWidth * .55;
    } else {
      screenWidth = screenWidth * .90;
    }

    this.setState({screenWidth, screenHeight})
  }

  onStepEnter = (city, {currentPosition, previousPosition}) => {
    this.setState({city})
    const el = document.querySelector(`#waypoint-${city}`)
    el.style.backgroundColor = '#85e085';
    el.style.border = "2px solid green"
  }

  onStepExit = (city, {currentPosition, previousPosition}) => {
    if( city === "nyc" && currentPosition === "below") {
      this.setState({city: ""})
    }

    const el = document.querySelector(`#waypoint-${city}`)
    el.style.backgroundColor = 'whitesmoke';
    el.style.border = "2px solid grey"
  }

  render() {
    const { classes } = this.props
    const { city, screenWidth, screenHeight } = this.state

    return (
      <div>
        <div className={classes.triggerTop}>trigger</div>
        <div className={classes.description}>
          Scrollytelling is a technique used to make changes to a graphic or other ui component as a reader scrolls down a page.
          In this example, I use <a href="https://www.npmjs.com/package/react-waypoint">react-waypoint</a>, a React interface of the <a href="http://imakewebthings.com/waypoints/">waypoints library</a>, to alter a line graph
          of weather data built with D3.js as you scroll. Try it out!
        </div>
        <div className={classes.container}>
          <div className={classes.graphic}>
            <p className={classes.title}>2018 Weather in: <span style={{color:"#1aa3ff", padding:"3px", borderRadius:"2px"}}>{cityNames[city]}</span></p>
            <BarChart width={screenWidth} height={screenHeight} data={city ? this.state.temps[city] : {} } />
          </div>
          <div className={classes.scroller}>
            {cities.map(city => {
              return (
                <Waypoint onEnter={((obj) => this.onStepEnter(city, obj))} onLeave={((obj) => this.onStepExit(city, obj))} scrollableAncestor={window} topOffset={"33%"} bottomOffset={"66%"} key={city}>
                  <div id={`waypoint-${city}`} className={classes.step} key={city}>{cityNames[city]} weather</div>
                </Waypoint>
              )
            })}
          </div>
        </div>
        <div style={{height:"600px"}}></div>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
