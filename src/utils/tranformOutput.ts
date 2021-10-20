import { FailResponse } from '../app.interface';
import { isNil } from 'ramda';

export default function<T>({
	error,
	data,
}: { error: null; data: T } | { error: FailResponse; data: null }) {
	const statusCode = isNil(error)
		? 200
		: (!isNil(error.message) && 400 || 500);
	const responseBody = isNil(error) ? data : error;

	return { statusCode, responseBody };
}
