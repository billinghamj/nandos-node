import crypto from 'crypto';
import request from 'request-promise-any';

type Options = {
	baseUrl: ?string;
	clientKeyId: string;
	clientKeySecret: string;
	userEmail: string;
	userPassword: string;
};

export default class Loyalty {
	_options: Options;
	_client: (method: string, uri: string, json: boolean, form: {}) => Promise;

	constructor(options: Options) {
		this._options = {
			baseUrl: 'https://www.nandos.co.uk/',
			...options,
		};

		this._client = request.defaults({
			baseUrl: this._options.baseUrl,
		});
	}

	async getAccount(): Promise<{}> {
		return await this._request('api_validate');
	}

	async getRewards(cardNumber: string): Promise<{}> {
		return await this._request('api_bonus_plan', {
			// eslint-disable-next-line camelcase
			card_number: cardNumber,
		});
	}

	async getTransactions(cardNumber: string): Promise<{}[]> {
		const result = await this._request('api_transaction_list', {
			// eslint-disable-next-line camelcase
			card_number: cardNumber,
		});

		return result.visit_data;
	}

	async _request(method: string, params: ?{}): Promise {
		const json = JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method,
			params: {
				email: this._options.userEmail,
				password: this._options.userPassword,
				...params,
			},
		});

		const hmac = crypto.createHmac('sha256', this._options.clientKeySecret);
		const hash = hmac.update(json, 'utf8').digest('hex');

		const response = await this._client({
			method: 'post',
			uri: '/js/nandoscard_json_api/call',
			json: true,
			form: {
				key: this._options.clientKeyId,
				request: json,
				signature: hash,
			},
		});

		if (response.error) {
			const error = new Error(response.executionStatusDescription || 'Unknown');

			error.response = response;
			error.code = response.code;

			throw error;
		}

		return response.result;
	}
}
