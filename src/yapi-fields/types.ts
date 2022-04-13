export interface Req_header {
	required: string;
	_id: string;
	name: string;
	value: string;
}

export interface Query_path {
	path: string;
	params: any[];
}

export interface Re_body {
	$schema: string;
	type: string;
	properties: Object;
}

export interface IYapiInterfaceDescription {
	id: number;
	method: string;
	path: string;
	title: string;
	desc: string;
	vip: string;
	projectId: number;
	req_headers: Req_header[];
	req_params: any[];
	req_query: any[];
	query_path: Query_path;
	req_body_form: any[];
	req_body_type: string;
	req_body_is_json_schema: boolean;
	res_body_is_json_schema: boolean;
	req_body: Re_body;
	status_code: number;
	res_body_type: string;
	res_body: Re_body;
	meta_type: string;
	status: string;
}

export interface IYapiCategory {
    id: number;
	name: string;
	desc: string;
	meta_type: string;
    projectId: number;
}

export interface IGroup {
	id: number;
	name: string;
	desc: string;
	meta_type: string;
}

export interface IGetYapiGroupListResponse {
	errcode: number;
	errmsg: string;
	data: IGroup[];
}
