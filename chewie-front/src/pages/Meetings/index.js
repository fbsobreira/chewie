import React, { Component } from 'react';

import API from '../../services/api';

import {
  Inject,
  ScheduleComponent,
  Day,
  Week,
  Month,
  ViewsDirective,
  ViewDirective,
  Agenda,
  ResourcesDirective,
  ResourceDirective,
}
  from '@syncfusion/ej2-react-schedule';

  import { extend, createElement } from '@syncfusion/ej2-base';

import './styles.css';

class Meetings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      rooms: [],
    }
    //TODO: add color to DB
    this.COLORS = ['#ffaa00', '#f8a398', '#7499e1'];
  }

  componentDidMount() {
    console.log("MOUNT")
    this.fetchData({});
    this.fetchRoom();
  }

  fetchData = async (data) => {
    return API.get('/meetings', data)
      .then(res => {
        console.log("DADOS", res)
        this.setState({
          meetings: res.data.map(meeting => {
            return {
              Id: meeting.id,
              Subject: meeting.name,
              StartTime: meeting.start,
              EndTime: meeting.end,
              Location: meeting.MeetingRoom.room,
              ResourceID: meeting.MeetingRoom.id
            }
          })
        });
      })
      .catch(error => {
        console.log('Error ', error);
        return { code: 'error', message: 'Cannot get meetings!' };
      });
  }

  fetchRoom = async () => {
    await API.get('/meetingRoom', {})
     .then(res => {
       this.setState({
          rooms: res.data.map(room => {
            return {
              Id: room.id,
              Name: `${room.name} - ${room.room}`,
              Color: this.COLORS[room.id-1],
            }
          })
       });
       
     })
     .catch(error => {
       console.log('Error ', error);
       return { code: 'error', message: 'Cannot get meetings!' };
   });
  }

  onActionComplete(args) {
    console.log({args})
    /*args.data 
      Id: 1
      Subject: 
      StartTime: 
      EndTime: 
      Location: 1
      ResourceID: 1
      IsAllDay: false
      StartTimezone: null
      EndTimezone: null
      Description: undefined
      RecurrenceRule: null
    */
    switch (args.requestType) {
      case "eventChanged":
        break
        case "eventCreated":
        break
        case "eventRemoved":
        break
    }
    
}

  render() {
    const {  meetings, rooms } = this.state
    return (
      <div className="schedule">
        <ScheduleComponent
          ref={schedule => this.scheduleObj = schedule}
          eventSettings={{ dataSource: meetings }}
          actionComplete={this.onActionComplete.bind(this)}
          height='800px' >
          <ViewsDirective>
            <ViewDirective
              option='Agenda'
              displayName='DIA'
            />
            <ViewDirective
              option='Day'
              displayName='DIA'
            />
            <ViewDirective
              option='Week'
              readonly={false}
              displayName='SEMANA'
              startHour='08:00'
              endHour='24:00'
            />
            <ViewDirective
              option='Month'
              displayName='MÊS'
            />
          </ViewsDirective>

          <ResourcesDirective>
            <ResourceDirective
              field='Location'
              title='Sala'
              name='Location'
              allowMultiple={false}
              dataSource={rooms}
              textField='Name'
              idField='Id'
              colorField='Color'>
            </ResourceDirective>
          </ResourcesDirective>


          <Inject services={[Agenda, Day, Week, Month]} />
        </ScheduleComponent>
      </div>
    );
  }
}

export default Meetings;