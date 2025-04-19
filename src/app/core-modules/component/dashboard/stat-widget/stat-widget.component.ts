import { Component } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

@Component({
    selector: 'app-stat-widget',
    imports: [NgClass, NgForOf],
    templateUrl: './stat-widget.component.html',
    styleUrl: './stat-widget.component.scss'
})
export class StatWidgetComponent {
    cards = [
        {
            title: 'Orders',
            value: '152',
            icon: 'pi-shopping-cart',
            bgColor: 'bg-blue-100 dark:bg-blue-400/10',
            iconColor: 'text-blue-500',
            change: '24 new',
            note: 'since last visit'
        },
        {
            title: 'Revenue',
            value: '$2.100',
            icon: 'pi-dollar',
            bgColor: 'bg-orange-100 dark:bg-orange-400/10',
            iconColor: 'text-orange-500',
            change: '%52+',
            note: 'since last week'
        },
        {
            title: 'Customers',
            value: '28441',
            icon: 'pi-users',
            bgColor: 'bg-cyan-100 dark:bg-cyan-400/10',
            iconColor: 'text-cyan-500',
            change: '520',
            note: 'newly registered'
        },
        {
            title: 'Comments',
            value: '152 Unread',
            icon: 'pi pi-comment',
            bgColor: 'bg-purple-100 dark:bg-purple-400/10',
            iconColor: 'text-purple-500',
            change: '85',
            note: 'responded'
        }
        // Add more objects here
    ];
}
