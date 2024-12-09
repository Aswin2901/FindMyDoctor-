from asgiref.sync import sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework.exceptions import AuthenticationFailed
from django.db import close_old_connections
from accounts.tokenauthentication import JWTAuthentication


class JWTWebsocketMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()

        # Extract token from query string
        query_string = scope.get("query_string", b"").decode("utf-8")
        query_parameters = dict(
            qp.split("=", 1) if "=" in qp else (qp, None) for qp in query_string.split("&")
        )
        token = query_parameters.get("token", None)

        if token is None:
            await send({
                "type": "websocket.close",
                "code": 4000  # Token not provided
            })
            return

        authentication = JWTAuthentication()

        try:
            # Wrap authenticate_websocket in sync_to_async
            user = await sync_to_async(authentication.authenticate_websocket)(scope, token)
            if user is not None:
                scope['user'] = user
            else:
                await send({
                    "type": "websocket.close",
                    "code": 4001  # Invalid token
                })
                return

            # Proceed to the next middleware or consumer
            return await super().__call__(scope, receive, send)

        except AuthenticationFailed:
            await send({
                "type": "websocket.close",
                "code": 4002  # Authentication failed
            })
