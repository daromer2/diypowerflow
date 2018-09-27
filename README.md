# diypowerflow
DIY Powerflow V2 (Esperyd edition)

I forked this to change it to 3 outputs. I will also add some custom things to it.


This a DIY version of the powerflow screen on the Tesla powerwall app.

You can check a running example at:

https://powerflow.romer.se
Above link uses my data live from my house. In progress so dont expect it always to be online


## Legacy text below

This example uses (for now) mine hardcoded userid of emoncms.

I will include in the next version, configuration to allow your own emoncms userid and the names for the feeds to be stored
in the browser. That way you can use this deployed app with your own emoncms values and not needing to host your own version of code.

Currently it pools the values from emoncms.org API feeds.

I will make it more flexible in the future to allow other options and not only being forced and dependent on emoncms,
like for example if you want to host the code in your system and maybe use values directly from your gear.

## How to post the values from your own components to emoncms:

Depending on your own gear/components you have for solar charging, inverters, powerwall shunt BMS and house/grid meters,
how you can get the values into emoncms is very specific to your own situation.

I currently use MPP PCM60x charger (Solar), [Batrium BMS](https://www.batrium.com/) with a Shunt (Powerwall) and two SDM120 meters (House & Grid),
and a raspberry PI to get the values from all those components and post them to emoncms API.

I will include more documentation (maybe some videos) explaining better how to do this exactly for people who need it.

If you have the same or similar components (like other MPP inverters) I suggest you check out the ISO for the raspberry that
Daniel Römer from [DIY Tech and Repairs](http://diytechandrepairs.nu/raspberry-solar/) has prepared,
since it includes already a lot of scripts which you can use and adapt for your own specific situation.


## TODO/ROADMAP:
* make configuration stored in browser for userid, API key, feed names
* improve dots animations, to better reflect current flowing
* make additional energy sources, like generator and wind turbines.
* ...? what ideas/suggestions do you have? join in!


