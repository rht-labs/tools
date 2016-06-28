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
- project_name: test-project
- environments:
  - { name: 'development' }
  - { name: 'test' }
  - { name: 'production' }
- teams:
  - { type: 'developer', name: 'developer' }
  - { type: 'operations', name: 'operations'}
  - { type: 'business', name: 'business'}
- rhmap:
    domain: http://xxxxx.com/ 
    username: xxxx@example.com
    password: pass
- openshift:
    hostname: xxxxx.xx.net
    port: 8443
    username: test
    password: 'password'
    wildcard_dns: '*.apps.xxxxx.net'

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
