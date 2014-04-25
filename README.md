# NXBCloud
Stream Link Directory with the following features
- Manage multimedia stream link URLs in master/detail structure
- JSON API for client sync.

## Link URL management
  - Manage all the links at the centeral place: NXBCloud web site
  - Clients, such as Android mobile apps, can download up-to-date list of links
  - Synchronization: Added/Removed/Changed links at the web site are can be downloaded to clients anytime necessary
    - Automatic/Manual sync. depending on client implementation
    - <emp>Removing/Changing is not implemented yet</emp>

## Master/detail structure
  - File 1
    - link 1
    - link 2
    - ...
  - File 2
    - line 1
    - ...

# Install
1. Install  [meteor link](https://www.meteor.com)
<pre>
$ curl https://install.meteor.com/ | sh
</pre>
  - Requires 'curl' command line tool

2. Install [meteorite link](https://github.com/oortcloud/meteorite/)
<pre>
$ sudo npm install -g meteorite
</pre>
  - Requires nodejs 'npm' 1.4.x or later
3. Clone the repo
<pre>
$ git clone https://github.com/simonkim/nxbcloud.git
</pre>

4. Update meteorite/meteor packages
<pre>
$ cd nxbcloud
$ mrt update
</pre>

# Run
<pre>
$ meteor
</pre>
  - And connect to [http://localhost:3000 link](http://localhost:3000) using a web browser
