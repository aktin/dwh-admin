/**
 * Created by Xu on 03.08.2017.
 *
 * Test Component
 */
import {Component} from '@angular/core';
import {HttpService, UrlService} from '../helpers';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Component({
    templateUrl: './test.component.html',
})
export class TestComponent {
    testObjects: any[] = [
        {
            name: 'Test Broker',
            method: 'GET',
            url: 'test/broker/status',
            status: 'untested',
            responseType: 'text'
        },
        {
            name: 'Test Email',
            method: 'POST',
            url: 'test/email/send',
            status: 'untested',
            responseType: 'text',
        },
        {
            name: 'Test R',
            method: 'POST',
            url: 'test/r/run',
            status: 'untested',
            responseType: 'text',
        },
        {
            name: 'Monatsbericht erzeugen und senden',
            method: 'POST',
            url: 'report/monthly/email',
            status: 'untested',
            final: 'other',
            alert: 'Bitte nun auf E-Mail warten.\nBerichtserzeugung dauert einige Minuten.\n' +
                'Fehlermeldungen werden nur im Wildfly-Logfile angezeigt.',
            responseType: 'text',
        }
    ];

    constructor(private _http: HttpService,
                private _urls: UrlService) {
    }

    test(testObj: any): void {
        testObj.status = 'loading';
        this.setColor(testObj);

        let obs$;
        if (testObj.method === "POST") {
            obs$ = this._http.post(this._urls.parse(testObj['url']), null, {responseType: testObj.responseType});
        } else {
            obs$ = this._http.get(this._urls.parse(testObj['url']), {responseType: testObj.responseType})
        }

        obs$.pipe(catchError(this._http.handleError))
            .subscribe({
                    next: data => {
                        if (testObj.final) {
                            testObj.status = testObj.final;
                            testObj.message = testObj.alert + '\n\n' + data;
                        } else {
                            testObj.status = 'success';
                            testObj.message = data;
                        }
                        this.setColor(testObj);
                    },
                    error: (error: any) => {
                        testObj.status = 'failure';
                        testObj.message = error;
                        this.setColor(testObj);
                    }
                }
            );
    }

    setColor(testObj: any): void {
        switch (testObj.status) {
            case 'success' :
                testObj.segmentStyle = 'green';
                testObj.buttonStyle = 'green basic';
                break;
            case 'failure' :
                testObj.segmentStyle = 'tertiary red inverted';
                testObj.buttonStyle = 'red';
                break;
            case 'other' :
                testObj.segmentStyle = 'yellow';
                testObj.buttonStyle = 'yellow';
                break;
            case 'loading' :
                testObj.segmentStyle = 'grey loading';
                testObj.buttonStyle = 'grey loading';
                break;
            default :
                testObj.segmentStyle = 'violet';
                testObj.buttonStyle = 'violet';
        }
    }

    get tests() {
        return this.testObjects;
    }
}
