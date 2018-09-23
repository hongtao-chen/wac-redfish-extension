# Redfish Device Solution for WAC

## Get Started
Refer to [redfish-device repo](https://github.com/hongtao-chen/redfish-device) for an example where to use it.

This is en example how to create a [Windows Admin Center solution extension](https://docs.microsoft.com/en-us/windows-server/manage/windows-admin-center/extend/develop-solution), so it can add the redfish device connection and uses the [REST forwarder gateway plugin](https://github.com/hongtao-chen/wac-rest) to talk to the redfish REST service in the backend pyhsical server.

## UI Framework
Unlike the official [SDK](https://cloudblogs.microsoft.com/windowsserver/2018/09/20/windows-admin-center-1809-and-sdk-now-generally-available/) I'm using the [Vue](https://github.com/vuejs/vue) as the UI framework, instead of [Angular](https://github.com/angular/angular). It's to demonstrate that we can write WAC extension with other JavaScript frameworks, not about which is better.