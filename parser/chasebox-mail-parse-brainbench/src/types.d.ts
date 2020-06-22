declare type Callback = (error: any, sucess: any) => void;

declare interface EmailAttachment {
	type?: string,
	content?: Buffer,
	contentType?: string,
	partId?: number,
	release?: string | null,
	contentDisposition?: string,
	filename?: string,
	contentId?: string,
	cid?: string,
	headers?: object,
	checksum?: string,
	size?: number
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