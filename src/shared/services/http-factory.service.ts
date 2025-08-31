import {
	HttpService,
} from './http.service'
import {
	mainAxios,
} from './mainAxion'

export class HttpFactoryService {
	public createHttpService(): HttpService {
		return new HttpService(mainAxios,)
	}
}
