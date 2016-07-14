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
- hosts: localhost
  vars_files:
    - config.yml
  tasks:
    - name: Set RH MAP Target
      fhc:
        action: target
        target: "{{ rhmap.domain }}"
    - name: Login to RH MAP
      fhc:
        action: login
        username: "{{ rhmap.username }}"
        password: "{{ rhmap.password }}"
    - name: Create MBaaS Target
      fhc:
        action: createMBaaSTarget
        mbaasName: "{{ project_name }}"
        fhMbaasHost: https://"{{ project_name }}"."{{ openshift.hostname }}"
        url: https://"{{ openshift.hostname }}":"{{ openshift.port }}"
        openshiftUsername: "{{ openshift.username }}"
        openshiftPassword: "{{ openshift.password }}"
        routerDNSUrl: "{{ openshift.wildcard_dns }}"
        environment: "{{ item.name }}"
      register: deployedmbaases
      with_items: 
        "{{ environments }}"
    - debug: 
        var: deployedmbaases
    - name: Create Environment
      fhc:
        action: createEnvironment
        mbaasName: "{{ project_name }}"
        environment: "{{ item.name }}"
      register: deployedenvironments
      with_items: 
        "{{ environments }}"
    - name: Create Project
      fhc:
        action: createProject
        projectName: "{{ project_name }}" 
      register: project_details
    - debug: 
        var: project_details
    - name: Create teams
      fhc:
        action: createTeam
        mbaasName: "{{ project_name }}"
        projectGuid: "{{ project_details.response.guid }}"
        environments: "{{ deployedenvironments.results | map(attribute='id')|join(',') }}"
        mbaases: "{{ deployedmbaases.results | map(attribute='id')|join(',') }}"
    - name: Create User
      fhc:
        action: createUser
        username: test@redhat.com
        email: test@redhat.com 
      register: user_details





```

###Via direct call
From the library folder
node fhc.js ./ansible_test_target_arguments
node fhc.js ./ansible_test_login_arguments
node fhc.js ./ansible_test_mbaas_arguments 

##Tests
npm test
