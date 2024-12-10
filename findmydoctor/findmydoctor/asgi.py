import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat.route import websocket_urlpatterns
from chat.channels_middleware import JWTWebsocketMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'findmydoctor.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTWebsocketMiddleware(
        AuthMiddlewareStack(
            URLRouter( websocket_urlpatterns)
        )
    ),
})
