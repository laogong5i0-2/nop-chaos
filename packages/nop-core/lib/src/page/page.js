/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ajaxFetch, ajaxRequest, importModule } from '../core';
import { useAdapter } from "../adapter";
let g_nextIndex = 0;
export function createPage(options) {
    let actions = Object.assign({}, options.actions);
    let page = {
        id: 'page_' + String(g_nextIndex++),
        adapter: useAdapter(),
        path: undefined,
        ajaxRequest: ajaxRequest,
        ajaxFetch: ajaxFetch,
        require: importModule,
        getAction(name) {
            return actions[name];
        },
        registerAction(name, fn) {
            actions[name] = fn;
        },
        resetActions() {
            actions = Object.assign({}, options.actions);
        },
        getComponent: options.getComponent,
        getComponentStore: options.getComponentStore,
        getState: options.getState,
        setState: options.setState
    };
    return page;
}