import React from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import "./calendar_components.css";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import {
  Card,
  CardHeader,
  IconButton,
  Avatar,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import { Table } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Chinese Score",
    dataIndex: "chinese",
  },
];
let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, "");

var cardstyle = {
  margin: "40px",
  height: "620px",
  width: "400px",
};

const mapStateToProps = (state) => {
  const email = state.emailDetails.emailCredentials;
  const EVENTS_LOAD = state.EVENTS_LOAD;
  const x = { email };
  return x;
};

class Calendar_Components extends React.Component {
  constructor() {
    super();
    this.state = {
      weekendsVisible: true,
      currentEvents: [],
      updateId: "",
    };
  }

  createEventId = () => {
    return String(eventGuid++);
  };

  isTimeInTodayBoundary(start,end) {
    //console.log("inputTime:",start,",",end);
    const now = new Date();

    // Start of today (00:00:00)
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // End of today (23:59:59.999)
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const targetStart = new Date(start);
    const targetEnd = new Date(end);

    return targetStart <= startOfDay && targetEnd >= endOfDay;
  }
  
  render() {
    let value = this.props.show || this.props.EVENTS_LOAD.length !== 0;
    //console.log("EVENTS_LOAD:",this.props.EVENTS_LOAD);
    return (
      // <div className=' '>
      <Grid
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        justifyContent="center"
      >
        {/* <Grid item sm={1} xs={0} md={2} lg={0} /> */}
        <Grid item md={8} sm={10} xs={12} lg={2}>
          <Card style={{ height: "700px",textAlign:"left", overflowY:"scroll" }}>
            <CardHeader
              avatar={<Avatar aria-label='recipe'>T</Avatar>}
              action={
                <IconButton aria-label='settings'>
                  <ShareIcon />
                </IconButton>
              }
              title="Today's Event's"
              style={{ textAlign: "center", fontSize: "15px" }}
              subheader='hey'
              titleTypographyProps={{ variant: "h5" }}
            />
            <div >{this.props.EVENTS_LOAD.map(this.renderSidebarEvent)}</div>
          </Card>
        </Grid>

        {/* <div className='sccroll' style={{ margin: "auto" }}> */}
          <Grid item xs={12} sm={10} md={8} lg={5} xl={4}>
            <div
              // className=' demo-app-main card-box-shadow1 calendar'
              // style={{ width: "800px", height: "656px", marginTop: "40px" }}
            >
              {value ? (
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  calendar
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  initialView='dayGridMonth'
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  eventResizableFromStart={true}
                  dayMaxEvents={true}
                  eventOverlap={false}
                  weekends={this.state.weekendsVisible}
                  initialEvents={this.props.EVENTS_LOAD} // alternatively, use the `events` setting to fetch from a feed
                  select={this.handleDateSelect}
                  eventContent={this.renderEventContent} // custom render function
                  eventClick={this.handleEventClick}
                  eventStartEditable={this.update_function}
                  eventsSet={this.handleEvents}
                  eventResize={this.resize}
                  eventDragStart={this.handle} // called after events are initialized/added/changed/removed
                />
              ) : null}
            </div>
          </Grid>
        {/* </div> */}
      </Grid>
      // </div>
    );
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handle = (events) => {
    this.setState({ updateId: events.event.id });
  };
  handleDateSelect = (selectInfo) => {
    let id;
    let title = prompt("Please enter a new title for your event");
    let color = prompt("Please enter a new color for your event");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        backgroundColor: color,
      });

      fetch(" http://localhost:3001/fetchCalendar", {
        method: "post",
        headers: { 
          Authentication: "Content-Type:application/json",
          "x-access-token":localStorage.getItem("token"),
        },
        body: JSON.stringify({
          email: this.props.email,
          startDate: selectInfo.start,
          endDate: selectInfo.end,
          title: title,
          backgroundColor: color,
          token: localStorage.getItem("token"),
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          alert(user);
          this.props.call_back();
        });
    }
    return;
  };

  handleEventClick = (clickInfo) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}' if yes enter anything else leave blank`
      )
    ) {
      clickInfo.event.remove();

      fetch(" http://localhost:3001/delete", {
        method: "post",
        headers: { 
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          email: this.props.email,
          id: clickInfo.event.id,
          token: localStorage.getItem("token"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.props.call_back();
          alert(data);
        })
        .catch((err) => console.log(err));
    }
  };

  resize = (event) => {
    let start1 = event.event.start;
    let end1 = event.event.end;
    let title1 = event.event.title;
    let color = event.event.backgroundColor;
    return fetch(" http://localhost:3001/update", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        sessionId: event.event.id,
        email: this.props.email,
        startDate: start1,
        endDate: end1,
        title: title1,
        backgroundColor: color,
        token: localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data);
      })
      .catch((err) => console.log(err));
    this.props.call_back();
  };

  handle = (events) => {
    this.setState({ updateId: events.event.id });
  };

  handleEvents = (events) => {
    for (let i = 0; i < events.length; i++) {
      if (this.state.updateId === events[i].id) {
        let start1 = events[i].startStr;
        let end1 = events[i].endStr;
        let title1 = events[i].title;
        let color = events[i].backgroundColor;
        fetch(" http://localhost:3001/update", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            email: this.props.email,
            sessionId: this.state.updateId,
            startDate: start1,
            endDate: end1,
            title: title1,
            backgroundColor: color,
            token: localStorage.getItem("token"),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data);
          })
          .catch((err) => console.log(err));
      }
      this.props.call_back();
    }
  };

  renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };

  renderSidebarEvent = (event) => {
    var option = {};
    const options = new Date(event.start).toLocaleTimeString([], option);
    if(this.isTimeInTodayBoundary(event.start,event.end))
      return (
        <List
          key={event.id}
          style={{
          overflowY: "scroll",
          overflow: "top",
            display: "inline",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "14px",
          }}
          className="ghumao"
        >
          <Card style={{display:"flex",justifyContent:"center",minHeight:"60px"}} >
            <li>
              <b>
                {formatDate(event.start, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })} 
              </b>
            </li>
            <li>{"    " + event.title}</li>
            <li>{"    " + options}</li>
          </Card>
        </List>
      );
  };
}

export default connect(mapStateToProps, null)(Calendar_Components);

// <div className="eventSection">{
//     parseInt(formatDate(event.start.substring(0,10), { day: "numeric" })) ===
//     parseInt(formatDate(todayStr,{day:'numeric'}))
//     ?
//   :
//   null
// }</div>
