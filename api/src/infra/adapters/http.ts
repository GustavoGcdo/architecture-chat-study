export interface HttpRequest {
  params?: any;
  body?: any;
  query?: any;
  headers?: any;
}

export interface HttpResponse {
  status: number;
  body: any;
}
