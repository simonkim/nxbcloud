# NXBCloud
Stream Link Directory with the following features
- Manage multimedia stream link URLs in master/detail structure
- JSON API for client sync.
- Drag and drop upload for adding multiple links easy

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

## Drag and drop upload
From a computer desktop GUI file system browser such as Mac Finder or Windows Explorer, drag one or multiple text files to the 'Drop zone' of the web site and new File and links will be added.
- Name of the uploaded file will become the title of 'File' entry in the web site.
- Format of the text file
<pre>
&lt;link&gt; &lt;label&gt;
</pre>

- Example of a text file with links, file name 'mysite.txt'
<pre>
http://mysite.com/path sample site link
</pre>
would create a 'File' entry with title 'mysite.txt' with the following new 'link' entry to the 'mylist.txt' File entry
  - link: <code>http://mysite.com/path</code>
  - label: <code>sample site link'</code>

## JSON API link
- 'File' entries: <code>/api/nxb</code>
- 'Link' entries for a 'File' entry: <code>/api/links/&lt;file_entry_id&gt;</code>

# Install
1. Install  [meteor](https://www.meteor.com)
<pre>
$ curl https://install.meteor.com/ | sh
</pre>
  - Requires 'curl' command line tool

2. Install [meteorite](https://github.com/oortcloud/meteorite/)
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
  - And connect to [http://localhost:3000](http://localhost:3000) using a web browser
