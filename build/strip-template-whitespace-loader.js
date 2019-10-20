const REGEX_TEMPLATE_STRINGS = /`.+?`/sg
const REGEX_IGNORABLE_WHITESPACE = /[\n|\t]/g

exports.default = (source) => {
	return source.replace(REGEX_TEMPLATE_STRINGS, (match) => match.replace(REGEX_IGNORABLE_WHITESPACE, ''))
}
