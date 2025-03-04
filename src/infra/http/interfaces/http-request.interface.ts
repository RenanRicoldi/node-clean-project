export interface HttpRequest<BodyType = unknown> {
  body: BodyType
  params: Record<string, string>
  query: Record<string, string | string[]>
  headers: Record<string, string>
}
