import React from 'react';
import './App.css';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import Overlay from 'pigeon-overlay'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ZoomInIcon from '@material-ui/icons/ZoomInTwoTone';
import ZoomOutIcon from '@material-ui/icons/ZoomOutTwoTone';
import { Typography } from '@material-ui/core';
import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  toolbar: {
    "position": "fixed",
    "top": 0,
    "botton": 0,
    "right": 0,
    "z-index": 2,
    "padding": theme.spacing(1)
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  pathSettings: {
    width: "300px",
    margin: theme.spacing(1)
  }
});

class MapView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      zoom: 12,
      points: [],
      paths: [],
      markers: [],
      newPointWindow: {
        opened: false,
        anchor: [],
        input: ""
      },
      newPathWindow: {
        opened: false,
        anchor: []
      },
      pointWindow: {
        opened: false,
        anchor: []
      },
      pathWindow: {
        opened: false,
        point: null
      },
      newPathMode: false,
      newPathSettingsMode: false,
      newPath: [],
      newPathSettings: {}
    }
    this.newPointInputValue = ""
  }

  componentDidMount() {
    fetch('http://localhost:8000/api/points')
      .then(res => res.json())
      .then(json => {
        this.setState({
          points: json
        }, this.render)
      });
      fetch('http://localhost:8000/api/paths')
      .then(res => res.json())
      .then(json => {
        this.setState({
          paths: json
        }, this.render)
      });
  }


  handleZoomInClick(event) {
    if (this.state.zoom < 18) {
      const newValue = this.state.zoom + 1
      this.setState({ zoom: newValue })
    }
  }
  handleZoomOutClick(event) {
    if (this.state.zoom > 1) {
      const newValue = this.state.zoom - 1
      this.setState({ zoom: newValue })
    }
  }


  handleMarkerClick({event, payload, anchor}) {
    if (this.state.points[payload].destination) {
      if (!this.state.newPathMode) {
        this.setState({
          newPathWindow: {
            opened: true,
            point: this.state.points[payload],
            pointId: payload
          }
        })
      } else {
        this.setState({
          newPathMode: false,
          newPath: [...this.state.newPath, payload],
          newPathSettingsMode: true
        })
      }
    }
  }
  handleMarkerMouseOver({event, payload, anchor}) {
    if (this.state.points[payload].destination) {
      this.setState({
        pointWindow: {
          opened: true,
          anchor: anchor,
          point: payload
        }
      })
    } else {
      const pathId = this.state.paths.findIndex(path => payload in path.points)
      if (pathId >= 0) {
        fetch('http://localhost:8000/api/pathinfo/' + pathId)
          .then(res => res.json())
          .then(json => {
            this.setState({
              pathWindow: {
                opened: true,
                point: payload,
                info: json
              }
            })
        });
      }
    }
  }
  handleMarkerMouseOut({event, payload, anchor}) {
    if (this.state.points[payload].destination) {
      this.setState({ pointWindow: { opened: false, anchor: [], point: payload }})
    } else {
      this.setState({ pathWindow: { opened: false, anchor: [], point: payload }})
    }
  }


  handleMapClick({ event, latLng, pixel }) {
    if (!this.state.newPathMode) {
      this.setState({ newPointWindow: { opened: true, anchor: latLng }})
    } else {
      const newPoint = {
        "name": "",
        "coords": latLng,
        "destination": false
      }
      fetch("http://localhost:8000/api/points", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPoint)
      }).then(res => {
        if (res.status === 201) {
          this.setState({
            points: [...this.state.points, newPoint],
            newPath: [...this.state.newPath, this.state.points.length]
          })
        } else if (res.status === 401) {
          console.log("Error adding marker")
        }
      })
    }
  }


  handleNewPointPlaceClick(event) {
    const newPoint = {
      "name": this.newPointInputValue,
      "coords": this.state.newPointWindow.anchor,
      "destination": true
    }
    fetch("http://localhost:8000/api/points", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPoint)
    }).then(res => {
      if (res.status === 201) {
        this.setState({
          newPointWindow: {
            opened: false,
            anchor: [],
            input: ""
          },
          points: [...this.state.points, newPoint]
        })
      } else if (res.status === 401) {
        console.log("Error adding marker")
      }
    })
  }
  handleNewPointCancelClick(event) {
    this.setState({ newPointWindow: { opened: false, anchor: [] }})
  }
  handleNewPointInputChange(event) {
    this.newPointInputValue = event.target.value
  }


  handleNewPathClick() {
    this.setState({
      newPathWindow: {
        opened: false,
        anchor: []
      },
      newPathMode: true,
      newPath: [this.state.newPathWindow.pointId]
    })
  }
  handleNewPathCancelClick() {
    this.setState({ newPathWindow: { opened: false, anchor: [] }})
  }


  handlePathSettingsNameChange(event) {
    this.setState({ newPathSettings: { ...this.state.newPathSettings, name: event.target.value }})
  }
  handlePathSettingsAvgSpeedChange(event) {
    this.setState({ newPathSettings: { ...this.state.newPathSettings, avgSpeed: event.target.value }})
  }
  handlePathSettingsAvgFuelConsumptionChange(event) {
    this.setState({ newPathSettings: { ...this.state.newPathSettings, avgFuelConsumption: event.target.value }})
  }
  handleNewPathDoneClick() {
    const newPath = {
      points: this.state.newPath,
      ...this.state.newPathSettings
    }
    fetch("http://localhost:8000/api/paths", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPath)
      }).then(res => {
        if (res.status === 201) {
          this.setState({
            paths: [...this.state.paths, newPath],
            newPath: [],
            newPathSettingsMode: false
          })
        } else if (res.status === 401) {
          console.log("Error adding path")
        }
      })
  }

  render() {
    const { classes } = this.props

    let newPathSettingsWindow;
    if (this.state.newPathSettingsMode) {
      const windowPoint = this.state.points[this.state.points.length - 1].coords
      newPathSettingsWindow = (
        <Overlay
          anchor={windowPoint.coords} offset={[-5, 0]}>
          <Card>
            <TextField
              onChange={this.handlePathSettingsNameChange.bind(this)}
              required id="pathName" label="Path name"
              className={classes.pathSettings}/><br/>
            <TextField
              onChange={this.handlePathSettingsAvgSpeedChange.bind(this)}
              required id="pathAvgSpeed" label="path speed, km/h"
              className={classes.pathSettings}/><br/>
            <TextField
              onChange={this.handlePathSettingsAvgFuelConsumptionChange.bind(this)}
              required id="pathFuelConsumtion" label="fuel consumption, l per 100 km"
              className={classes.pathSettings}/>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleNewPathDoneClick.bind(this)}
              >Done</Button>
            </CardActions>
          </Card>
        </Overlay>
      )
    }

    let newPathWindow;
    if (this.state.newPathWindow.opened) {
      newPathWindow = (
        <Overlay
          anchor={this.state.newPathWindow.point.coords} offset={[-5, 0]}>
          <Card>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNewPathClick.bind(this)}
            >New Path</Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleNewPathCancelClick.bind(this)}
            >Cancel</Button>
          </CardActions>
          </Card>
        </Overlay>
      )
    } else newPathWindow = ""

    let pathWindow;
    if (this.state.pathWindow.opened) {
      const pathWindowPoint = this.state.points[this.state.pathWindow.point]
      const path = this.state.paths.find(path => this.state.pathWindow.point in path.points)
      const timeMinutesTotal = Math.round(this.state.pathWindow.info.time * 60)
      const timeMinutes = timeMinutesTotal % 60
      const timeHours = Math.floor(timeMinutes / 60)
      const timeHoursLabel = timeHours !== 0 ? `${timeHours} h` : ""
      const timeMinutesLabel = timeMinutes !== 0 ? `${timeMinutes} m` : ""
      pathWindow = (
        <Overlay
          anchor={pathWindowPoint.coords} offset={[-5, 0]}>
          <Card>
            <CardContent>
              <Typography gutterBottom>
                {path.name}
              </Typography>
              <Typography variant="overline" component="h2">
                distance: {this.state.pathWindow.info.distance} km
              </Typography>
              <Typography variant="overline" component="h2">
                time: {timeHoursLabel} {timeMinutesLabel}
              </Typography>
              <Typography variant="overline" component="h2">
                fuel: {this.state.pathWindow.info.fuel} l
              </Typography>
            </CardContent>
          </Card>
        </Overlay>
      )
    } else pathWindow = ""

    let pointWindow
    if (this.state.pointWindow.opened) {
      const pointWindowPoint = this.state.points[this.state.pointWindow.point]
      pointWindow = (
        <Overlay
          style={{ display: this.state.pointWindow.opened ? "block" : "none" }}
          anchor={this.state.pointWindow.anchor} offset={[-5, 0]}>
          <Card>
            <CardContent>
              <Typography gutterBottom>
                {pointWindowPoint.name}
              </Typography>
              <Typography variant="overline" component="h2">
                paths:
              </Typography>
              {this.state.paths.filter(path => this.state.pointWindow.point in path.points).map((path, i) => {
                return <Typography key={i} color="textSecondary" variant="body2" component="p">{path.name}</Typography>
              })}
            </CardContent>
          </Card>
        </Overlay>
      )
    } else pointWindow = ""

    let newPointWindow;
    if (this.state.newPointWindow.opened) {
      newPointWindow = (
        <Overlay
          anchor={this.state.newPointWindow.anchor} offset={[-5, 0]}>
          <Card>
            <CardContent>
              <FormControl>
                <InputLabel htmlFor="my-input">New Point</InputLabel>
                <Input
                  id="my-input"
                  aria-describedby="my-helper-text"
                  onChange={this.handleNewPointInputChange.bind(this)}
                />
                <FormHelperText id="my-helper-text">Enter name of the point</FormHelperText>
              </FormControl>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleNewPointPlaceClick.bind(this)}
              >Place</Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleNewPointCancelClick.bind(this)}
              >Cancel</Button>
            </CardActions>
          </Card>
        </Overlay>
      )
    }

    return (
      <div className="App">
        <div className={classes.toolbar} position="fixed">
          <IconButton
            onClick={this.handleZoomOutClick.bind(this)}
            variant="contained"
            color="secondary">
            <ZoomOutIcon/>
          </IconButton>
          <IconButton
            onClick={this.handleZoomInClick.bind(this)}
            variant="contained"
            color="secondary">
            <ZoomInIcon/>
          </IconButton>
        </div>
        <Map
          defaultCenter={[46.485722, 30.743444]}
          zoom={this.state.zoom}
          width={window.innerWidth}
          height={window.innerHeight}
          onClick={this.handleMapClick.bind(this)}
          mouseEvents={
            !this.state.newPointWindow.opened &&
            !this.state.newPathWindow.opened &&
            !this.state.newPathSettingsMode
          }
        >{
          this.state.points.map((point, i) => {
            return (
              <Marker
                anchor={point.coords}
                payload={i}
                key={i}
                onClick={this.handleMarkerClick.bind(this)}
                onMouseOver={this.handleMarkerMouseOver.bind(this)}
                onMouseOut={this.handleMarkerMouseOut.bind(this)}
              />
            )
          })}
          {newPointWindow}
          {pointWindow}
          {pathWindow}
          {newPathWindow}
          {newPathSettingsWindow}
        </Map>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MapView)
