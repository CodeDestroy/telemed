import {$api} from "../api";

class ConferenceService {
    static async joinConference (conferenceEvent) {
        return await $api.post("/api/conference/join", {conferenceEvent});
    }

    static async leaveConference  (conferenceEvent)  {
        return await $api.post("/api/conference/leave", {conferenceEvent});
    }

    static async participantJoined (conferenceEvent)  {
        return await  $api.post("/api/conference/participantJoined",  {conferenceEvent});
    }
    static async endConference (roomName, protocol)  {
        return await $api.post("/api/conference/end", {roomName, protocol});
    }
}

export default ConferenceService;