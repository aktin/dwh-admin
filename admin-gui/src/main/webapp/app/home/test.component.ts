/**
 * Created by Xu on 03.08.2017.
 *
 * Test Component
 */
import { Component } from '@angular/core';
import { UrlService, HttpInterceptorService } from '../helpers/services/index';
import { HttpClient, RequestMethod, Response, Request } from '@angular/http';

@Component({
    templateUrl: './test.component.html',
})
export class TestComponent  {
    testObjects: any[] = [
        {
            name: 'Test Broker',
            method: RequestMethod.Get,
            url: 'test/broker/status',
            status: 'untested',
        },
        {
            name: 'Test Email',
            method: RequestMethod.Post,
            url: 'test/email/send',
            status: 'untested',
        },
        {
            name: 'Test R',
            method: RequestMethod.Post,
            url: 'test/r/run',
            status: 'untested',
        },
        {
            name: 'Monatsbericht erzeugen und senden',
            method: RequestMethod.Post,
            url: 'report/monthly/email',
            status: 'untested',
            final: 'other',
            alert: 'Bitte nun auf E-Mail warten.\nBerichtserzeugung dauert einige Minuten.\n' +
            'Fehlermeldungen werden nur im Wildfly-Logfile angezeigt.',
        }
    ];

    constructor (private _http: HttpClient,
                private _urls: UrlService ) { }

    test (testObj: any): void {
        testObj.status = 'loading';
        this.setColor(testObj);

        this._http.request(new Request({method: testObj.method, url: this._urls.parse(testObj['url'])}))
            .subscribe(
                data => {
                    if (testObj.final) {
                        testObj.status = testObj.final;
                        testObj.message = testObj.alert + '\n\n' + data.text();
                    } else {
                        testObj.status = 'success';
                        testObj.message = data.text();
                    }
                    this.setColor(testObj);
                },
                (error: Response) => {
                    testObj.status = 'failure';
                    testObj.message = error.text();
                    this.setColor(testObj);
                }
            );
    }

    setColor (testObj: any): void {
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
