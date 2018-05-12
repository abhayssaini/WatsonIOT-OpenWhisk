import requests
def main(iot_obj):
    dbname="YourCloudantDbName"
    url="YourCloudantUrl"
    payload ={ "dbname":dbname,"url": url,"id":iot_obj["id"]}
    #publish Watson Assistant intent/entity pair to Watson IOT platform and subsequently all subscribed devices
    print (payload)
    return payload