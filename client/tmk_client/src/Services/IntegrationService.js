import {$api} from "../api";

export default class IntegrationService {

    static async getOnlineSched () {
        return $api.get('/api/integration/getOnlineSched');
    }

}
