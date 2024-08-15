export default async function fetchJson<T>(url: string) {
	const response = await fetch(url)
	return await (response.json() as Promise<T>)
}
