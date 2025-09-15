from django.http import JsonResponse
from decouple import config


def test_env(request):
    env1 = config("ENV_KEY1", default="default_value1")
    env2 = config("ENV_KEY2", default="default_value2")
    env3 = config("ENV_KEY3", default="default_value3")
    return JsonResponse({"env1": env1, "env2": env2, "env3": env3})
