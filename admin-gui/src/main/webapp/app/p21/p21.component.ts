/**
 * Drag n Drop File upload styling by https://github.com/progtarek/angular-drag-n-drop-directive
 */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { P21Service } from './p21.service';

@Component({
    selector: 'app-root',
    templateUrl: './p21.component.html',
    styleUrls: ['./p21.component.css'],
})
export class P21Component {

    @ViewChild('fileDropArea') fileDropEl: ElementRef;
    files: any[] = [];

    constructor(private _p21service: P21Service) {
        _p21service.sayHello();
        console.log('Hello, I am the P21Component');
    }

    /**
     * Checks if the user has the given permission.
     * @returns the permission that will be checked
     */
    isAuthorized(permission: string) {
        return this._p21service.checkPermission(permission);
    }

    // handler for dropped files
    onFileDropped($event: any[]) {
        this.prepareFileList($event);
    }

    // handler for file browsing
    onFileBrowse(files: any[]) {
        this.prepareFileList(files);
    }

    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFile(index: number) {
        if (this.files[index].progress < 100) {
            return;
        }
        this.files.splice(index, 1);
    }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFileList(files: Array<any>) {
        for (const item of files) {
            item.progress = 0;
            this.files.push(item);
        }
        this.fileDropEl.nativeElement.value = '';
        this.progressBarUpload(0);
    }

    /**
     * Simulate the upload process
     */
    progressBarUpload(index: number) {
        setTimeout(() => {
            if (index === this.files.length) {
                return;
            } else {
                const progressInterval = setInterval(() => {
                    if (this.files[index].progress === 100) {
                        clearInterval(progressInterval);
                        this.progressBarUpload(index + 1);
                    } else {
                        this.files[index].progress += 5;
                    }
                }, 200);
            }
        }, 1000);
    }

    /**
     * format size of files
     * @param bytes (file size in bytes)
     * @param decimals (decimals point)
     */
    formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) { return '0 Bytes'; }
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
