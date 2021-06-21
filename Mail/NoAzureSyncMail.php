<?php

namespace WebApps\Apps\StaffDirectory\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;

class NoAzureSyncMail extends Mailable
{
    use Queueable, SerializesModels;

    public function build()
    {
        return $this->view('StaffDirectory::emails.NoAzureSync')
                    ->with([
                       'Settings_URL' => URL::to('/apps/StaffDirectory/settings'),
                       'last_sync' => ApplicationSettings::get('app.StaffDirectory.azure.last_sync')
                    ]);
    }
}