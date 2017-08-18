Default Theme
===================

A generic Theme for Referral SaaSquatch.

Setup
-----

To get started making changes to your theme:
1. Clone the project: 

    `$ git clone git@github.com:saasquatch/default-theme.git`

2. Install the [saasquatch-cli](https://github.com/saasquatch/saasquatch-cli) tool (requires node.js): 

    `$ npm install -g saasquatch-cli`

3. Commit and push changes to your theme repository.
4. Use [saasquatch-cli](https://github.com/saasquatch/saasquatch-cli) to republish either your test or live tenant's theme with the latest changes from the repository:

    `$ squatch publish -t test_alu125hh1si9w -k TEST_BHASKh5125Las5hL125oh3VbLmPxUSs`

    **Options**

    ```
    -t, --tenant [tenant]  required - tenant alias for which tenant to use
    -k, --apiKey [apiKey]  required - API key corresponding to the tenant
    ```
License
-------

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
