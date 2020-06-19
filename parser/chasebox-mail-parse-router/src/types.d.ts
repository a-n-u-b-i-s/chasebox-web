declare type Callback = (error: object | string | null, sucess: object | string | null) => void;

declare interface S3Record {
	s3: {
		object: {
			key: string
		},
		bucket: {
			name: string
		}
	}
}

declare interface S3Event {
	Records: Array<S3Record>
}

declare interface S3Object {
	Body: Buffer
}

declare type BigParserRow = any;

declare type BigParserRows = Array<BigParserRow>;

declare interface BigParserResponseData {
	authId?: string,
	rows?: BigParserRows
	totalRowCount?: number
}

declare interface AxiosResponse {
	data: BigParserResponseData,
	status: number,
	statusText: string,
	headers: object,

}

declare interface EmailAttachment {
	type: string,
	content: Buffer,
	contentType: string,
	partId: number,
	release: string | null,
	contentDisposition: string,
	filename: string,
	contentId: string,
	cid: string,
	headers: object,
	checksum: string,
	size: number
}

declare interface EmailHeaderLine {
	key: string,
	line: string
}

declare interface EmailContact {
	address: string,
	name: string
}

declare interface EmailAdresses {
	value: Array<EmailContact>,
	html: string,
	text: string
}

declare interface Email {
	attachments?: Array<EmailAttachment>,
	headers?: object,
	headerLines: Array<EmailHeaderLine>,
	html?: string,
	text: string,
	textAsHtml?: string,
	subject: string,
	date: string,
	to: EmailAdresses,
	from: EmailAdresses,
	messageId?: string
}

declare type JoinOperator = "OR" | "AND"

declare interface GlobalFilter {
	operator?: "LIKE" | "NLIKE" | "EQ" | "NEQ",
	keyword: string
}

declare interface ColumnFilter {
	column: string,
	operator?: "LIKE" | "NLIKE" | "EQ" | "NEQ" | "GT" | "GTE" | "LT" | "LTE" | "IN",
	keyword: string
}

declare interface Filter<T> {
	filters: Array<T>,
	filtersJoinOperator?: JoinOperator
}

declare interface QueryObject {
	query: {
		globalFilter?: Filter<GlobalFilter>,
		columnFilter?: Filter<ColumnFilter>,
		globalColumnFilterJoinOperator?: JoinOperator,
		selectColumnNames?: Array<string>,
		sort?: object,
		pagination?: {
			startRow: number,
			rowCount: number
		},
		sendRowIdsInResponse?: boolean,
		showColumnNamesInResponse?: boolean,
	}
}

declare interface Rule {
	name: string,
	filter: (row: BigParserRow, email: Email) => boolean
}

declare interface Hook {
	name: string,
	action: (url: string, email: Email) => any
}

declare interface Endpoint {
	type: string,
	url: string,
	action: (url: string, email: Email) => any
}
