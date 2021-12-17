<?php

namespace WebApps\Apps\StaffDirectory\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;
use WebApps\Apps\StaffDirectory\Models\Person;

class RecordDeletedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $person;

    public $themeArr = [
        'indigo' => '4F46E5',
        'fucshia' => '7C3AED',
        'light-blue' => '0284C7',
        'red' => 'DC2626',
        'orange' => 'EA580C',
        'yellow' => 'CA8A04',
        'lime' => '65A30D',
        'gray' => '52525B',
    ];

    public function __construct(Person $person)
    {
        $this->person = $person;
    }

    public function build()
    {
        return $this->view('StaffDirectory::emails.RecordDeleted')
                ->with([
                    'url' => URL::to('/'),
                    'theme' => $this->themeArr[ApplicationSettings::get('core.ui.theme')],
                ]);
    }
}
