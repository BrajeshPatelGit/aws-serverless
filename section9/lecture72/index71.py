import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context=None):
    logger.info('Received event: %s', json.dumps(event, indent=2))

    method = event.get('requestContext', {}).get('http', {}).get('method', 'UNKNOWN')
    query_param = (event.get('queryStringParameters') or {}).get('message')

    if query_param is None:
        logger.warning('Missing queryStringParameters.message in event')
        return {
            'statusCode': 400,
            'body': json.dumps('Missing query parameter "message"'),
        }

    logger.info('Received %s request with %s', method, query_param)
    return {
        'statusCode': 200,
        'body': json.dumps(f'Hello from {query_param}'),
    }
