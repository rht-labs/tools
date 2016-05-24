fhc admin mbaas delete --id=ph-mbaas-test-dev
fhc admin mbaas delete --id=ph-mbaas-test-test
fhc admin mbaas delete --id=ph-mbaas-test-live
oc delete project ph-mbaas-test-dev
oc delete project ph-mbaas-test-test
oc delete project ph-mbaas-test-live