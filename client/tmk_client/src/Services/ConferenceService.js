import $api from "../api";

class ConferenceService {
    static async joinConference (conferenceEvent) {
        return await $api.post("/api/conference/join", {conferenceEvent});
    }

    static async leaveConference  (conferenceEvent)  {
        return await $api.post("/api/conference/leave", {conferenceEvent});
    }
}

export default ConferenceService;