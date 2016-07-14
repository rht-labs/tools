#FHC Ansible Module
Node.js Ansible module to enable calls the the fh-fhc npm module.
When Ansible calls this script it is first exported to a temp script.  The script is then called from a temp directory created by Ansible.
For this reason, we must set an environment variable with the location of the modules: FHMODULE_HOME


e.g. export FHMODULE_HOME=/pathtorepo/tools/rhmap/ansible/library

Module is limited to supporting a subset of FHC commands currently
* target
* login
* admin.mbaas.create
* admin.environments.create
* admin.teams.create
* project create
* app get guid
* app get git url
* admin-users create

##Usage

###Via ansible playbook
ansible-playbook -vvv deployMbaaS.yml

Uses config.yml file e.g.
---
- engagement_name: samplecompany
- projects: 
  - {name: 'project3' }
  - {name: 'project4' }
- environments:
  - { name: 'development', is_live: 0 }
  - { name: 'production', is_live: 1 }
- teams:
  - { type: 'developer', name: 'developer' }
  - { type: 'operations', name: 'operations'}
  - { type: 'business', name: 'business'}
  - { type: 'business', name: 'tester'}
- rhmap:
    domain: https://xxxxxx.redhatmobile.com/ 
    username: xxxxxx
    password: xxxxxx
    users:
      - { team: 'developer', username: 'dev@example.com', email: 'dev@example.com' }
      - { team: 'developer', username: 'dev2@example.com', email: 'dev2@example.com' }
      - { team: 'operations', username: 'ops@example.com', email: 'ops@example.com' }
      - { team: 'business', username: 'bus@example.com', email: 'bus@example.com' }
- openshift:
    hostname: xxxxx.feedhenry.net
    dns_name: xxxxxx.feedhenry.net
    port: 8443
    username: xxxxx
    password: 'xxxxxxx'
    wildcard_dns: '*.xxxxx.feedhenry.net'
- jenkins:
    url: http://127.0.0.1:8080
    username: admin
    password: admin

```yaml

---

  # tasks file for RHMAP
  - name: Set RH MAP Target
    fhc:
      action: target
      target: "{{ rhmap.domain }}"
  - name: Login to RH MAP
    fhc:
      action: login
      username: "{{ rhmap.username }}"
      password: "{{ rhmap.password }}"
  - name: Get cloud app details
    fhc:
      action: getAppDetails
      projectName:  "{{ item.name }}"
      appType: cloud_nodejs
    register: appDetails
    with_items: 
      "{{ projects }}"
  - name: update jenkins cloud app config.xml
    template: src=config.xml dest=./config-{{item.item.name}}.xml
    with_items:
      "{{ appDetails.results }}"
  - name: create jenkins job for cloud app
    command: 'curl -u "{{ jenkins.username }}":"{{ jenkins.password }}"  "{{ jenkins.url }}"/createItem?name={{ engagement_name }}-{{ item.name }}-cloud -X POST -d "@config-"{{ item.name }}".xml" -H "Content-Type: application/xml"'
    with_items: 
      "{{ projects }}"
  - name: Get client app details
    fhc:
      action: getAppDetails
      projectName:  "{{ item.name }}"
      appType: client_hybrid
    register: cliantAppDetails
    with_items: 
      "{{ projects }}"
  - debug: var=cliantAppDetails
  - name: update jenkins cloud app config.xml
    template: src=client-config.xml dest=./client-config-{{item.item.name}}.xml
    with_items:
      "{{ cliantAppDetails.results }}"
  - name: create jenkins job for cloud app
    command: 'curl -u "{{ jenkins.username }}":"{{ jenkins.password }}"  "{{ jenkins.url }}"/createItem?name={{ engagement_name }}-{{ item.name }}-client -X POST -d "@client-config-"{{ item.name }}".xml" -H "Content-Type: application/xml"'
    with_items: 
      "{{ projects }}"

  ```

###Via direct call
From the library folder
node fhc.js ./ansible_test_target_arguments
node fhc.js ./ansible_test_login_arguments
node fhc.js ./ansible_test_mbaas_arguments 

##Tests
npm test
