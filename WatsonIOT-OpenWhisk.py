import requests
def main(iot_obj):
    # import IOT platform credentials
    iot_org_id = "YourOrdId"
    device_id = "YourDeviceId"
    device_type = "YourDeviceType"
    api_token = "AuthToken"
    # extract result from Watson Assistant
    payload = {"d": iot_obj}
    # publish Watson Assistant intent/entity pair to Watson IOT platform and subsequently all subscribed devices
    requests.post('https://' + iot_org_id + '.messaging.internetofthings.ibmcloud.com:8883/api/v0002/device/types/'
    + device_type + '/devices/' + device_id + '/events/query', headers={'Content-Type': 'application/json'}, 
    json=payload, auth=('use-token-auth', api_token))
    return {"msg": payload}